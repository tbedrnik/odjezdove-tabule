// import ApiKey from '#models/api_key'
import Board from '#models/board'
import { getDepartureBoard } from '#services/golemio_service'
import type { HttpContext } from '@adonisjs/core/http'

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
      .debug(true)
      .firstOrFail()

    const { trips, infotexts, now } = await getDepartureBoard(board.stations, board.apiKey.token)

    return inertia.render('boards/board', {
      name: board.name,
      trips,
      infotexts,
      now,
    })
  }
}
