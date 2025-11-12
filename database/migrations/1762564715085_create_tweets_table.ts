import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tweets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('slug').notNullable().unique()
      table.string('title').notNullable().unique()
      table.text('content').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
      table.dropColumn('title')
      table.dropColumn('content')
    })
  }
}
