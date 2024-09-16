import Station from '#models/station'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import papa from 'papaparse'
import { fileURLToPath } from 'node:url'

type CSVRow = {
  stop_id: string
  stop_name: string
  stop_lat: number
  stop_lon: number
  platform_code: string
}

export default class extends BaseSeeder {
  async run() {
    const csvPath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      './data/gfts_stops_trimmed.csv'
    )

    const csvContents = await readFile(csvPath, 'utf-8')

    const parseResult = papa.parse<CSVRow>(csvContents, { dynamicTyping: true, header: true })

    await Station.updateOrCreateMany(
      ['gtfsId'],
      parseResult.data.map((stop) => ({
        gtfsId: stop.stop_id,
        latitude: stop.stop_lat,
        longitude: stop.stop_lon,
        name: [stop.stop_name, ...(stop.platform_code ? [`(${stop.platform_code})`] : [])].join(
          ' '
        ),
      }))
    )
  }
}
