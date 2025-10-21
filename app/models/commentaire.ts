import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Media from './media.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Like from './like.js'
import Signet from './signet.js'
import Tweet from './tweet.js'
import User from './user.js'
import { DateTime } from 'luxon'

export default class Commentaire extends BaseModel {
  @column({ isPrimary: true })
  declare idCommentaire: number

  @column()
  declare contenu: string | null

  @column.dateTime()
  declare dateCommentaire: DateTime

  @column()
  declare idMedia: number | null

  @belongsTo(() => Media, { foreignKey: 'idMedia' })
  declare media: BelongsTo<typeof Media>

  @hasMany(() => Like, { foreignKey: 'idCommentaire' })
  declare likes: HasMany<typeof Like>

  @hasMany(() => Signet, { foreignKey: 'idCommentaire' })
  declare signets: HasMany<typeof Signet>

  @hasMany(() => Tweet, { foreignKey: 'idCommentaire' })
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => User, { foreignKey: 'idCommentaire' })
  declare users: HasMany<typeof User>
}
