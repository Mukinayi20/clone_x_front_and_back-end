import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'signets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('commentaire_id').references('commentaires.id').onDelete('CASCADE')
      table.integer('tweets_id').references('tweets.id_tweet').onDelete('CASCADE')
      table.integer('users_id').references('users.id_user').onDelete('CASCADE')
      table.timestamp('date_signet').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
