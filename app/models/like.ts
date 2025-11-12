import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tweet from '#models/like'
import Commentaire from '#models/commentaire'
import { DateTime } from 'luxon'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idUser: number

  @column()
  declare idTweet: number

  @column()
  declare idCommentaire: number

  @column()
  declare dateLike: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Tweet, { foreignKey: 'tweetId', localKey: 'idTweet' })
  declare tweet: BelongsTo<typeof Tweet>

  @belongsTo(() => Commentaire, { foreignKey: 'idCommentaire' })
  declare commentaire: BelongsTo<typeof Commentaire>
}
