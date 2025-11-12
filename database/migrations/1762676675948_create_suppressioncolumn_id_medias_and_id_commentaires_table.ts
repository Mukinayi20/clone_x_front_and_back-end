import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tweets'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('id_media')
      table.dropColumn('id_commentaire')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('id_media')
      table.string('id_commentaire')
    })
  }
}
