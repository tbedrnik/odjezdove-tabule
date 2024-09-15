import { getDepartureBoard } from '#services/golemio_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class TablesController {
  async index({ inertia }: HttpContext) {
    const { trips, infotexts, now } = await getDepartureBoard()

    return inertia.render('tables/table', {
      trips,
      infotexts,
      now,
    })
  }
}
