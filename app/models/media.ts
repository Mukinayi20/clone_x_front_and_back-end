import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import Tweet from './tweet.js'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string | null

  @column()
  declare tweetId: number

  @belongsTo(() => Tweet, { foreignKey: 'tweetId', localKey: 'idTweet' })
  declare tweet: BelongsTo<typeof Tweet>

  @hasMany(() => Message, { foreignKey: 'idMedia' })
  declare messages: HasMany<typeof Message>
}
