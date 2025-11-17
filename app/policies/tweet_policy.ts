import User from '#models/user'
import Tweet from '#models/tweet'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class TweetPolicy extends BasePolicy {
  alterPost(user: User, tweet: Tweet) {
    return user.idUser === tweet.userId
  }
}
