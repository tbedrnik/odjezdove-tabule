import { InferPageProps } from '@adonisjs/inertia/types'
import TablesController from '#controllers/tables_controller'
import { Head } from '@inertiajs/react'
import { Snowflake, Footprints } from 'lucide-react'

import TravelBus from '../../svg/travel-bus.svg'
import TravelCableway from '../../svg/travel-cableway.svg'
import TravelFerry from '../../svg/travel-ferry.svg'
import TravelMetro from '../../svg/travel-metro.svg'
import TravelTrain from '../../svg/travel-train.svg'
import TravelTram from '../../svg/travel-tram.svg'
import TravelTrolley from '../../svg/travel-trolley.svg'

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr)

  const H = d.getHours().toString()
  const MM = d.getMinutes().toString().padStart(2, '0')

  return `${H}:${MM}`
}

export default function Table({ trips, infotexts }: InferPageProps<TablesController, 'index'>) {
  console.log(trips)

  return (
    <>
      <Head title="Table" />

      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto px-4 py-8 flex flex-col gap-4">
          <div className="flex flex-row-reverse items-center justify-between gap-4">
            <p className="text-3xl font-semibold text-primary pr-5">
              {formatTime(new Date().toISOString())}
            </p>
            {infotexts.length > 0 && (
              <ul className="bg-orange-400 shadow-lg rounded-lg divide-y divide-gray-200 px-6 py-4">
                {infotexts.map((infotext) => (
                  <li>{infotext}</li>
                ))}
              </ul>
            )}
          </div>
          <ul className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
            {trips.map((trip) => (
              <li key={trip.tripId} className={`p-6${trip.isWalkable ? '' : ' opacity-50'}`}>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 pt-1">
                    <div className="bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center">
                      {trip.routeType === 'bus' && <TravelBus className="w-10 h-10" />}
                      {trip.routeType === 'trolleybus' && <TravelTrolley className="w-10 h-10" />}
                      {trip.routeType === 'train' && <TravelTrain className="w-10 h-10" />}
                      {trip.routeType === 'tram' && <TravelTram className="w-10 h-10" />}
                      {trip.routeType === 'metro' && <TravelMetro className="w-10 h-10" />}
                      {trip.routeType === 'funicular' && <TravelCableway className="w-10 h-10" />}
                      {trip.routeType === 'ferry' && <TravelFerry className="w-10 h-10" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-gray-900">{trip.routeName}</p>
                        {trip.isAirConditioned === true && (
                          <Snowflake className="w-6 h-6 text-blue-500" />
                        )}
                        {trip.isAirConditioned === false && (
                          <Snowflake className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <p className="text-2xl font-semibold text-primary">
                        {formatTime(trip.stopTimes.predicted)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg text-gray-600">
                        {trip.stopName} → {trip.routeEndStopName}
                      </p>
                      {!!trip.stopWalkTime && (
                        <div
                          className={`flex items-center justify-end text-sm ${trip.isWalkable ? 'text-gray-500' : 'text-red-600'}`}
                        >
                          <Footprints className="w-4 h-4 mr-1" />
                          <span>{trip.stopWalkTime} min</span>
                        </div>
                      )}
                    </div>
                    {trip.lastSeenAtStopName && (
                      <p className="text-sm text-gray-500 mt-2">
                        Last seen at: {trip.lastSeenAtStopName}
                      </p>
                    )}
                    {trip.throughStops.length > 0 && (
                      <div className="mt-4">
                        <ul className="space-y-2">
                          {trip.throughStops.map((stop) => (
                            <li
                              key={stop.stopId}
                              className="flex justify-between items-center bg-gray-100 rounded-lg p-3"
                            >
                              <span className="text-sm font-medium text-gray-700">
                                {stop.stopName}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTime(stop.stopTimes.predicted)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
