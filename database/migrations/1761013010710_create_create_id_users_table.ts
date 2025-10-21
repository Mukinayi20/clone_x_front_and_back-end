import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_id_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_user').primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
