import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'likes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('likes_count')
    })
  }
}
