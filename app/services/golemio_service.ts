import { golemioToken } from '#config/golemio'
import * as GolemioApiTypes from './golemio-api-schema.js'

type PIDDepartureBoard = GolemioApiTypes.components['schemas']['PIDDepartureBoard']
type PIDDepartureBoardStopTime = GolemioApiTypes.components['schemas']['PIDDepartureBoardStopTime']

const input = [
  // Vozovna Kobylisy v ulici Klapkova smer Kobylisy
  {
    stopId: 'U864Z5P',
    showDepartures: true,
    minutesToWalk: 5,
  },
  // Mirovicka smer Kobylisy
  {
    stopId: 'U1011Z2P',
    showDepartures: true,
    minutesToWalk: 3,
  },
  // Kobylisy tram smer Ke strice
  {
    stopId: 'U675Z1P',
    showDepartures: true,
    minutesToWalk: 12,
  },
  // Libensky Zamek smer Palmovka
  {
    stopId: 'U471Z1P',
    showDepartures: false,
  },
  // Kobylisy metro smer centrum
  {
    stopId: 'U675Z102P',
    showDepartures: true,
    minutesToWalk: 12,
  },
]

export async function getDepartureBoard() {
  const url = new URL('/v2/pid/departureboards', 'https://api.golemio.cz')

  for (const stopId of input.map((i) => i.stopId)) {
    url.searchParams.append('ids', stopId)
  }

  // const now = new Date('2024-09-16T05:00:00Z')
  const now = new Date()

  url.searchParams.set('timeFrom', now.toISOString())

  url.searchParams.set('mode', 'departures')
  url.searchParams.set('minutesAfter', '240')
  url.searchParams.set('mode', 'departures')
  url.searchParams.set('airCondition', 'true')

  url.searchParams.set('limit', '50')
  url.searchParams.set('mode', 'departures')
  url.searchParams.append('skip', 'canceled')

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Access-Token': golemioToken.release(),
    },
  })

  const data = (await res.json()) as PIDDepartureBoard

  const { departures, stops } = data

  // TODO: map infotexts with stopnames and times
  const infotexts = (data.infotexts ?? []).map((i) => i.text)

  if (!stops) {
    return { trips: [], infotexts }
  }

  const stopsNames = Object.fromEntries(stops.map((stop) => [stop.stop_id, stop.stop_name]))

  if (!departures) {
    return { trips: [], infotexts }
  }

  const trips: Record<
    string,
    {
      tripId: string
      routeName: string
      routeType: string
      routeEndStopName: string
      stopId: string
      stopName: string
      stopTimes: PIDDepartureBoardStopTime
      stopWalkTime: number | null
      isWalkable: boolean
      lastSeenAtStopName: string | null
      isAirConditioned: boolean | null
      throughStops: { stopId: string; stopName: string; stopTimes: PIDDepartureBoardStopTime }[]
    }
  > = {}

  const departureStopsMap = new Map(input.filter((i) => i.showDepartures).map((i) => [i.stopId, i]))

  for (const item of departures) {
    const { trip, stop, route } = item

    if (!stop) continue
    if (!trip) continue
    if (!route) continue

    const tripId = trip.id
    const routeEndStopName = trip.headsign
    const isAirConditioned = trip.is_air_conditioned
    const stopId = stop.id

    if (tripId in trips) {
      const { arrival_timestamp: stopTimes } = item
      if (!stopTimes) continue

      trips[tripId].throughStops.push({
        stopId,
        stopName: stopsNames[stopId],
        stopTimes,
      })

      continue
    }

    const departureStop = departureStopsMap.get(stopId)

    if (departureStop) {
      const { departure_timestamp: stopTimes } = item
      if (!stopTimes) continue

      if (isImpossibleToCatch(stopTimes.predicted, departureStop.minutesToWalk, now)) continue

      trips[tripId] = {
        tripId,
        routeType: getRouteType(route.type),
        routeName: route.short_name ?? '?',
        routeEndStopName,
        stopId,
        stopName: stopsNames[stopId],
        stopTimes,
        stopWalkTime: departureStop.minutesToWalk ?? null,
        isWalkable: isWalkable(stopTimes.predicted, departureStop.minutesToWalk, now),
        isAirConditioned,
        lastSeenAtStopName: item.last_stop?.name ?? null,
        throughStops: [],
      }
    }
  }

  return { trips: Object.values(trips), infotexts }
}

function isImpossibleToCatch(
  leavesAt: string,
  minutesToWalk: number | undefined,
  now = new Date()
) {
  const IMPOSSIBILITY_MINUTES = 2

  return !isWalkable(leavesAt, (minutesToWalk ?? 0) - IMPOSSIBILITY_MINUTES, now)
}

function isWalkable(leavesAt: string, minutesToWalk: number | undefined, now = new Date()) {
  const arriveAt = now.valueOf() + (minutesToWalk ?? 0) * 60 * 1000

  return new Date(leavesAt) >= new Date(arriveAt)
}

function getRouteType(routeType: number | null) {
  switch (routeType) {
    case 0:
      return 'tram'
    case 1:
      return 'metro'
    case 2:
      return 'train'
    case 3:
      return 'bus'
    case 4:
      return 'ferry'
    case 7:
      return 'funicular'
    case 11:
      return 'trolleybus'
  }

  return '?'
}
