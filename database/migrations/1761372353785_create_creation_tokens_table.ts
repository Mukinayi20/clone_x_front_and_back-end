import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('verified').defaultTo(false)
      table.string('verification_token').nullable
      table.timestamp('token_expires_at').nullable
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('verified')
      table.dropColumn('verificatio_token')
      table.dropColumn('token_expires_at')
    })
  }
}
