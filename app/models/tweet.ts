import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import Like from './like.js'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Signet from './signet.js'
import Media from './media.js'
import Commentaire from './commentaire.js'
import User from './user.js'
import { DateTime } from 'luxon'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare idTweet: number

  @column()
  declare contentTweet: string

  @column.dateTime()
  declare dateTweet: DateTime

  @column()
  declare idMedia: number | null

  @column()
  declare idCommentaire: number | null

  @hasMany(() => Like, { foreignKey: 'idTweet' })
  declare likes: HasMany<typeof Like>

  @hasMany(() => Signet, { foreignKey: 'idTweet' })
  declare signets: HasMany<typeof Signet>

  @belongsTo(() => Media, { foreignKey: 'idMedia' })
  declare media: BelongsTo<typeof Media>

  @belongsTo(() => Commentaire, { foreignKey: 'idCommentaire' })
  declare commentaire: BelongsTo<typeof Commentaire>

  @hasMany(() => User, { foreignKey: 'idTweet' })
  declare users: HasMany<typeof User>
}
