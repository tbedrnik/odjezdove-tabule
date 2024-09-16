import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import { type HasMany, type BelongsTo } from '@adonisjs/lucid/types/relations'
import BoardStation from './board_station.js'
import ApiKey from './api_key.js'

export default class Board extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => BoardStation)
  declare stations: HasMany<typeof BoardStation>

  @column()
  declare apiKeyId: number

  @belongsTo(() => ApiKey)
  declare apiKey: BelongsTo<typeof ApiKey>
}
