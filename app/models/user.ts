import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Follow from './follow.js'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Message from './message.js'
import Tweet from '#models/tweet'
import Commentaire from './commentaire.js'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  public static primaryKey = 'id_user'

  @column({ isPrimary: true })
  declare idUser: number

  @column()
  declare email: string

  @column()
  declare numTel: number

  @column()
  declare nom: string

  @column()
  declare prenom: string

  @column()
  declare bio: string | null

  @column()
  declare password: string

  @column()
  declare photo_profil: string | null

  @column()
  declare photo_couverture: string | null

  @column.dateTime()
  declare birthday: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare anneeCreation: unknown

  @column()
  declare adresse: string | null

  @column()
  declare webSite: string | null

  @column()
  declare idTweet: number | null

  @column()
  declare idCommentaire: number | null

  @column()
  declare verification_token: string | null

  @column()
  declare token_expires_at: string | null

  @column()
  declare verified: boolean | null

  @hasMany(() => Tweet)
  public tweet: HasMany<typeof Tweet> | undefined

  @hasMany(() => Follow, { foreignKey: 'idFollowers' })
  declare followers: HasMany<typeof Follow>

  @hasMany(() => Follow, { foreignKey: 'idFollowing' })
  declare following: HasMany<typeof Follow>

  @hasMany(() => Message, { foreignKey: 'sender' })
  declare sentMessages: HasMany<typeof Message>

  @hasMany(() => Message, { foreignKey: 'receiver' })
  declare receivedMessages: HasMany<typeof Message>
}
