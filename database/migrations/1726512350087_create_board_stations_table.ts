import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'board_stations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.boolean('show_departures').notNullable()
      table.integer('minutes_to_walk').nullable()

      table.integer('board_id').notNullable().references('id').inTable('boards').index()
      table.integer('station_id').notNullable().references('id').inTable('stations')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
