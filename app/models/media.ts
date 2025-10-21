import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Commentaire from './commentaire.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import Tweet from './tweet.js'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare idMedia: number

  @column()
  declare urlMedia: string | null

  @column()
  declare typeMedia: string | null

  @hasMany(() => Commentaire, { foreignKey: 'idMedia' })
  declare commentaires: HasMany<typeof Commentaire>

  @hasMany(() => Message, { foreignKey: 'idMedia' })
  declare messages: HasMany<typeof Message>

  @hasMany(() => Tweet, { foreignKey: 'idMedia' })
  declare tweets: HasMany<typeof Tweet>
}
