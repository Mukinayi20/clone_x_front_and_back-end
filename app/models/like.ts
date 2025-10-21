import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tweet from './tweet.js'
import Commentaire from './commentaire.js'

export default class Like extends BaseModel {
  @column({ isPrimary: true })
  declare idLike: number

  @column()
  declare idUser: number | null

  @column()
  declare idTweet: number | null

  @column()
  declare idCommentaire: number | null

  @belongsTo(() => User, { foreignKey: 'idUser' })
  declare users: BelongsTo<typeof User>

  @belongsTo(() => Tweet, { foreignKey: 'idTweet' })
  declare tweet: BelongsTo<typeof Tweet>

  @belongsTo(() => Commentaire, { foreignKey: 'idCommentaire' })
  declare commentaire: BelongsTo<typeof Commentaire>
}
