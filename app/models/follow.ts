import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Follow extends BaseModel {
  @column({ isPrimary: true })
  declare idFollow: number

  @column()
  declare idFollowers: number | null

  @column()
  declare idFollowing: number | null

  @belongsTo(() => User, { foreignKey: 'idFollowers' })
  declare follower: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'idFollowing' })
  declare following: BelongsTo<typeof User>
}
