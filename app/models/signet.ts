import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tweet from './tweet.js'
import Commentaire from './commentaire.js'
import { DateTime } from 'luxon'

export default class Signet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare idTweet: number

  @column()
  declare idCommentaire: number

  @column()
  declare dateSignet: DateTime

  @belongsTo(() => User, { foreignKey: 'idUser' })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Tweet, { foreignKey: 'idTweet' })
  declare tweet: BelongsTo<typeof Tweet>

  @belongsTo(() => Commentaire, { foreignKey: 'idCommentaire' })
  declare Commentaire: BelongsTo<typeof Commentaire>
}
