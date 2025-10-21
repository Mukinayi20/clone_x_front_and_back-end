import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Media from './media.js'
import { DateTime } from 'luxon'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare idMessage: number

  @column()
  declare contentMessage: string

  @column()
  declare statutMessage: string | null

  @column.dateTime()
  declare dateEnvoie: DateTime

  @column.dateTime()
  declare dateReception: DateTime

  @column.dateTime()
  declare dateLecture: DateTime

  @column()
  declare sender: number | null

  @column()
  declare receiver: number | null

  @column()
  declare idMedia: number | null

  @belongsTo(() => User, { foreignKey: 'sender' })
  declare senderRelation: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiver' })
  declare receiverRelation: BelongsTo<typeof User>

  @belongsTo(() => Media, { foreignKey: 'idMedia' })
  declare media: BelongsTo<typeof Media>
}
