import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { DateTime } from 'luxon'
import Media from './media.js'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare idTweet: number

  @column()
  declare content: string

  @column()
  declare slug: string

  @column()
  declare userId: number

  @column.dateTime()
  declare dateTweet: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'idUser',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => Media, {
    foreignKey: 'tweetId',
    localKey: 'idTweet',
  })
  declare medias: HasMany<typeof Media>

  @hasMany(() => Media, {
    foreignKey: 'tweetId',
    localKey: 'idTweet',
  })
  declare likes: HasMany<typeof Media>
  static merge: any
  // @hasMany(() => User, { foreignKey: 'idTweet' })
  // declare users: HasMany<typeof User>
  // static id_tweet: number | undefined
}
