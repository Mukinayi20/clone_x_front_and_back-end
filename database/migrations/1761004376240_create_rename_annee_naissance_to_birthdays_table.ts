import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RenameAnneeNaissanceToBirthday extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.renameColumn('annee_naissance', 'birthday')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.renameColumn('birthday', 'annee_naissance')
    })
  }
}
