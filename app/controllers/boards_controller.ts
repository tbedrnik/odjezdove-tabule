// import ApiKey from '#models/api_key'
import Board from '#models/board'
import BoardStation from '#models/board_station'
import { getDepartureBoard } from '#services/golemio_service'
import { updateBoardValidator } from '#validators/boards'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class BoardsController {
  async index({ inertia, auth }: HttpContext) {
    const boards = await Board.findManyBy('userId', auth.user!.id)

    return inertia.render('boards/index', {
      boards: boards.map((b) => b.serialize({ fields: { pick: ['id', 'name'] } })),
    })
  }

  async show({ inertia, params, auth }: HttpContext) {
    const board = await Board.query()
      .preload('apiKey')
      .preload('stations', (s) => s.preload('station'))
      .where({ id: params.id, userId: auth.user!.id })
      .firstOrFail()

    const { trips, infotexts, now } = await getDepartureBoard(board.stations, board.apiKey.token)

    return inertia.render('boards/board', {
      name: board.name,
      trips,
      infotexts,
      now,
    })
  }

  async edit({ inertia, params, auth }: HttpContext) {
    const board = await Board.query()
      .preload('stations', (s) => s.preload('station'))
      .where({ id: params.id, userId: auth.user!.id })
      .firstOrFail()

    return inertia.render('boards/edit', {
      id: board.id,
      name: board.name,
      stations: board.stations.map((s) => ({
        id: s.id,
        showDepartures: s.showDepartures,
        minutesToWalk: s.minutesToWalk,
        station: {
          id: s.station.id,
          name: s.station.name,
        },
      })),
    })
  }

  async update({ params, auth, request, response }: HttpContext) {
    const data = await request.validateUsing(updateBoardValidator)

    const trx = await db.transaction()

    trx.debug = true

    const board = await Board.query({ client: trx })
      .preload('stations')
      .where({ id: params.id, userId: auth.user!.id })
      .firstOrFail()

    const { toUpsert, toDelete } = splitItems(board.stations, data.boardStations)

    // Update Board
    board.name = data.name
    await board.useTransaction(trx).save()

    // Upsert BoardStations
    if (toUpsert.length > 0) {
      board.related('stations').updateOrCreateMany(toUpsert, ['stationId'], { client: trx })
    }

    // Delete BoardStations
    if (toDelete.length > 0) {
      await BoardStation.query({ client: trx }).whereIn('id', toDelete).delete()
    }

    await trx.commit()

    return response.redirect().toRoute('boards.edit', params)
  }
}

type NextBoardStations = Awaited<ReturnType<typeof updateBoardValidator.validate>>['boardStations']

const splitItems = (prev: BoardStation[], next: NextBoardStations) => {
  const toUpsert: NextBoardStations = []
  const keepIds = new Set<number>()
  const toDelete = []

  for (const boardStation of next) {
    if (boardStation.id) {
      if (!prev.some((bs) => bs.id === boardStation.id)) {
        throw new Exception(
          `Cannot update board station id:${boardStation.id}, because it does not exist on the board`
        )
      }

      keepIds.add(boardStation.id)
    }

    toUpsert.push(boardStation)
  }

  for (const boardStation of prev) {
    if (!keepIds.has(boardStation.id)) {
      toDelete.push(boardStation.id)
    }
  }

  return { toUpsert, toDelete }
}
