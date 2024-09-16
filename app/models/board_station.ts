import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Board from './board.js'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import Station from './station.js'

export default class BoardStation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare showDepartures: boolean

  @column()
  declare minutesToWalk: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare boardId: number

  @belongsTo(() => Board)
  declare board: BelongsTo<typeof Board>

  @column()
  declare stationId: number

  @belongsTo(() => Station)
  declare station: BelongsTo<typeof Station>
}
