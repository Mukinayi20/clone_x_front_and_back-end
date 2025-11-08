import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameAnneeNaissanceToBirthday extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('photo_profil').nullable
      table.string('photo_couverture').nullable
      table.string('bio').nullable
      table.string('adresse').nullable
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('photo_profil')
      table.dropColumn('photo_couverture')
      table.dropColumn('bio')
      table.dropColumn('adresse')
    })
  }
}
