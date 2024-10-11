import BoardsController from '#controllers/boards_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head, useForm } from '@inertiajs/react'
import { Label } from '@radix-ui/react-label'
import { useQuery } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/app/components/ui/button'
import { Input } from '~/app/components/ui/input'
import { useDebouncedValue } from '~/app/hooks/use_debounced_value'
import { cn } from '~/app/lib/utils'

type BoardStation = {
  id?: number
  station: Station
  minutesToWalk: number | null
  showDepartures: boolean
}

type BoardStationToSend = {
  id?: number
  stationId: number
  minutesToWalk: number | null
  showDepartures: boolean
}

export default function EditBoard(props: InferPageProps<BoardsController, 'edit'>) {
  const [name, setName] = useState(props.name)
  const [boardStations, setBoardStations] = useState<BoardStation[]>(props.stations)
  const [showAddStationModal, setShowAddStationModal] = useState(false)

  const { data, setData, errors, put, processing } = useForm<{
    name: string
    boardStations: BoardStationToSend[]
  }>({
    name,
    boardStations: boardStations.map((bs) => ({
      id: bs.id,
      showDepartures: bs.showDepartures,
      minutesToWalk: bs.minutesToWalk,
      stationId: bs.station.id,
    })),
  })

  useEffect(() => {
    setData({
      name,
      boardStations: boardStations.map((bs) => ({
        id: bs.id,
        showDepartures: bs.showDepartures,
        minutesToWalk: bs.minutesToWalk,
        stationId: bs.station.id,
      })),
    })
  }, [name, boardStations])

  console.log(data, errors)

  const mutate = () => {
    return put(`/boards/${props.id}`)
  }

  const isStationChanged = useCallback(
    (station: BoardStation) => {
      if (!station.id) {
        return false
      }

      const before = props.stations.find((s) => s.id === station.id)

      if (!before) {
        return false
      }

      return (
        before.minutesToWalk !== station.minutesToWalk ||
        before.showDepartures !== station.showDepartures
      )
    },
    [props.stations]
  )

  return (
    <>
      <Head title={`Úprava tabule - ${name}`} />

      <div className="bg-slate-100 dark:bg-slate-950 min-h-screen">
        <div className="mx-auto px-4 py-8 flex flex-col gap-8">
          <div className="grid gap-2">
            <Label htmlFor="name">Název tabule</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              required
            />
          </div>

          <ul className="flex flex-col gap-2">
            {boardStations.map((boardStation, i) => (
              <li key={boardStation.station.id}>
                <div
                  className={cn(
                    'block bg-card text-card-foreground border shadow-lg dark:shadow-none px-6 py-4 rounded-lg relative',
                    !boardStation.id && 'outline outline-green-400 outline-2',
                    boardStation.id &&
                      isStationChanged(boardStation) &&
                      'outline outline-orange-300 outline-2'
                  )}
                >
                  <div className="flex gap-4 items-center">
                    <div className="mr-auto">{boardStation.station.name}</div>
                    <div className="flex gap-2 items-center">
                      <Label htmlFor={`${i}-showDepartures`}>Show departures</Label>
                      <input
                        type="checkbox"
                        id={`${i}-showDepartures`}
                        className="w-4 h-4"
                        checked={boardStation.showDepartures}
                        onChange={(e) =>
                          setBoardStations((prev) => {
                            const next = [...prev]
                            next.splice(i, 1, {
                              ...boardStation,
                              showDepartures: e.target.checked,
                            })
                            return next
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label htmlFor={`${i}-minutesToWalk`}>Minutes to walk</Label>
                      <Input
                        id={`${i}-minutesToWalk`}
                        type="number"
                        value={boardStation.minutesToWalk ?? ''}
                        placeholder="0"
                        min={0}
                        className="w-16"
                        onChange={(e) =>
                          setBoardStations((prev) => {
                            const next = [...prev]
                            const v = +e.target.value
                            next.splice(i, 1, {
                              ...boardStation,
                              ...(Number.isInteger(v) && { minutesToWalk: v }),
                            })
                            return next
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-slate-500 hover:text-destructive"
                        onClick={() => {
                          setBoardStations((prev) => {
                            const next = [...prev]
                            next.splice(i, 1)
                            return next
                          })
                        }}
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <Button variant="outline" onClick={() => setShowAddStationModal(true)}>
              Add new station to board
            </Button>
          </div>
          <div>
            <Button onClick={() => mutate()} disabled={processing}>
              Save board
            </Button>
          </div>
        </div>
      </div>

      {showAddStationModal && (
        <AddStationModal
          usedStationIds={boardStations.map((station) => station.station.id)}
          onAddStation={(station) => {
            setBoardStations((stations) => [
              ...stations,
              { station, showDepartures: true, minutesToWalk: null },
            ])
            setShowAddStationModal(false)
          }}
          onClose={() => setShowAddStationModal(false)}
        />
      )}
    </>
  )
}

type Station = {
  id: number
  name: string
}

type AddStationModalProps = {
  usedStationIds: number[]
  onAddStation: (station: Station) => void
  onClose: () => void
}

const AddStationModal = ({ usedStationIds, onAddStation, onClose }: AddStationModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const sanitizedSearchQuery = useDebouncedValue(searchQuery.trim(), 300)

  const { data, isFetching } = useQuery({
    queryKey: ['stations/search', sanitizedSearchQuery, usedStationIds],
    queryFn: async () => {
      const url = new URL('/stations/search', location.origin)
      url.searchParams.set('q', sanitizedSearchQuery)
      for (const e of usedStationIds) {
        url.searchParams.append('e', e.toString())
      }
      const body: {
        matches: Station[]
      } = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }).then((response) => response.json())
      return body
    },
    enabled: sanitizedSearchQuery.length > 2,
  })

  return (
    <div
      className="fixed inset-0 bg-black/60 grid items-center justify-center"
      onClick={() => onClose()}
    >
      <div className="p-4 rounded bg-background relative" onClick={(e) => e.stopPropagation()}>
        <div className="grid gap-4 grid-flow-row">
          <div className="grid gap-2">
            <Label htmlFor="searchQuery">Search query</Label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              id="searchQuery"
              required
              autoFocus
            />
          </div>
        </div>
        <span>{isFetching ? 'Searching...' : 'Results:'}</span>
        <ul>
          {data?.matches.map((station) => (
            <li key={station.id}>
              <div>
                <span>{station.name}</span>
                <Button size="sm" onClick={() => onAddStation(station)}>
                  Add to board
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
