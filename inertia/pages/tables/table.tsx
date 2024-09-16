import { InferPageProps } from '@adonisjs/inertia/types'
import TablesController from '#controllers/tables_controller'
import { Head, router } from '@inertiajs/react'
import { Snowflake, Footprints } from 'lucide-react'
import { formatTime } from '~/utils/time'
import { CurrentTime } from '~/app/components/current_time'
import { RouteTypeIcon } from '~/app/components/route_type_icon'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Table({
  trips,
  infotexts,
  now,
}: InferPageProps<TablesController, 'index'>) {
  console.log(trips)

  useEffect(() => {
    const interval = setInterval(() => router.reload(), 15_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head title="Odjezdová tabule" />

      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen">
        <div className="mx-auto px-4 py-8 flex flex-col gap-4">
          <div className="flex flex-row-reverse items-center justify-between gap-4">
            <p className="text-3xl font-semibold text-primary dark:text-primary-foreground pr-5">
              <CurrentTime />
            </p>
            <p className="pl-5 text-sm text-slate-600 dark:text-slate-500">
              Updated at: {formatTime(now, true)}
            </p>
            {infotexts.length > 0 && (
              <ul className="bg-orange-400 shadow-lg rounded-lg divide-y divide-slate-200 px-6 py-4">
                {infotexts.map((infotext) => (
                  <li>{infotext}</li>
                ))}
              </ul>
            )}
          </div>
          <ul className="flex flex-col gap-2">
            <AnimatePresence mode="sync">
              {trips.map((trip) => (
                <motion.li
                  key={trip.tripId}
                  layout
                  className="shadow-lg dark:shadow-none bg-white dark:bg-slate-900 p-6 rounded-lg first:rounded-t-lg last:rounded-b-lg"
                  animate={{ scale: 1, opacity: trip.isWalkable ? 1 : 0.5 }}
                  transition={{ type: 'tween', ease: 'easeInOut' }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 pt-1">
                      <div className="bg-primary dark:bg-slate-700 text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center">
                        <RouteTypeIcon routeType={trip.routeType} className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-primary dark:text-primary-foreground">
                            {trip.routeName}
                          </p>
                          {trip.isAirConditioned === true && (
                            <Snowflake className="w-6 h-6 text-blue-500" />
                          )}
                          {trip.isAirConditioned === false && (
                            <Snowflake className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                          )}
                        </div>
                        <p className="text-2xl font-semibold text-primary dark:text-primary-foreground">
                          {formatTime(trip.stopTimes.predicted)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                          {trip.stopName} → {trip.routeEndStopName}
                        </p>
                        {!!trip.stopWalkTime && (
                          <div
                            className={`flex items-center justify-end text-sm ${trip.isWalkable ? 'text-slate-600 dark:text-slate-400' : 'text-red-600'}`}
                          >
                            <Footprints className="w-4 h-4 mr-1" />
                            <span>{trip.stopWalkTime} min</span>
                          </div>
                        )}
                      </div>
                      {trip.lastSeenAtStopName && (
                        <p className="text-sm text-slate-500 mt-2">
                          Last seen at: {trip.lastSeenAtStopName}
                        </p>
                      )}
                      {trip.throughStops.length > 0 && (
                        <div className="mt-4">
                          <ul className="space-y-2">
                            {trip.throughStops.map((stop) => (
                              <li
                                key={stop.stopId}
                                className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-3"
                              >
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-400">
                                  {stop.stopName}
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                  {formatTime(stop.stopTimes.predicted)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </>
  )
}
