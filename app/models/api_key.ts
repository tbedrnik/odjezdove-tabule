import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import { type HasMany, type BelongsTo } from '@adonisjs/lucid/types/relations'
import { Secret } from '@adonisjs/core/helpers'
import Board from './board.js'

export default class ApiKey extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ consume: (value) => new Secret(value) })
  declare token: Secret<string>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Board)
  declare boards: HasMany<typeof Board>
}
