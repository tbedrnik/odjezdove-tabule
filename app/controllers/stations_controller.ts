import Station from '#models/station'
import { searchValidator } from '#validators/search'
import type { HttpContext } from '@adonisjs/core/http'

export default class StationsController {
  async search({ request }: HttpContext) {
    const { q, e } = await request.validateUsing(searchValidator)

    const query = Station.query().whereILike('name', `%${q}%`)

    if (e && e.length > 0) {
      query.andWhereNotIn('id', e)
    }

    const stations = await query.debug(true).limit(20)

    return {
      matches: stations.map((s) =>
        s.serializeAttributes({ pick: ['id', 'name', 'longitude', 'latitude'] })
      ),
    }
  }
}
