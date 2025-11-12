import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'media'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('created_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('created_at')
    })
  }
}
