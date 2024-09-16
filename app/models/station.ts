import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Station extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gtfsId: string

  @column()
  declare name: string

  @column()
  declare latitude: number

  @column()
  declare longitude: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
