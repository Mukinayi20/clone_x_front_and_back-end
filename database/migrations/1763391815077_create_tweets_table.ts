import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tweets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_tweet').primary()
      table.string('content', 500).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.integer('user_id').unsigned().references('id_user').inTable('users').onDelete('CASCADE')
      table.dateTime('date_tweet').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
