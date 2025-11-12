import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commentaires'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('content').nullable()
      table.timestamp('date_ommentaire').notNullable()
      table.integer('tweet_id').references('tweets.id_tweet').onDelete('CASCADE')
      table.integer('users_id').references('users.id_user').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
