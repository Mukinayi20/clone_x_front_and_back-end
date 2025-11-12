import Commentaire from '#models/commentaire'
import Like from '#models/like'
import Media from '#models/media'
import Signet from '#models/signet'
import Tweet from '#models/tweet'
import { storePostValidator } from '#validators/post'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import path from 'node:path'

export default class PostController {
  /**
   * Display a list of resource
   */
  async index({ view, auth, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 50
    const tweets = await Tweet.query()
      .select('idTweet', 'content', 'user_id')
      .preload('user', (u) => u.select('prenom', 'nom', 'photo_profil'))
      .preload('medias', (mediaQuery) => {
        mediaQuery.select('id', 'url')
      })
      .orderBy('date_tweet', 'desc')
      .paginate(page, limit)

    // const medias = await Media.query()
    //   .select('id', 'url', 'tweet_id')
    //   .preload('tweet', (u) => u.select('idTweet'))

    return view.render('layout/accueils/acceuil', { tweets, user: auth.user })
  }

  async like({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const tweetId = params.id

    const existingLike = await Like.query()
      .where('idUser', user.idUser)
      .where('idTweet', tweetId)
      .first()

    if (existingLike) {
      await existingLike.delete()
    } else {
      await Like.create({
        idUser: user.idUser,
        idTweet: tweetId,
      })
    }
  }

  /**
   * Display form to create a new record
   */
  async create({ view }: HttpContext) {
    return view.render('component/post')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, auth, session, response }: HttpContext) {
    try {
      const { content, slugImg } = await request.validateUsing(storePostValidator)
      const user = auth.user!

      let filePath: string | undefined

      function generateUniqueName(prefix = 'item') {
        const random = Math.random().toString(36).substring(2, 10) // 8 caractères aléatoires
        return `${prefix}_${random}`
      }
      const slug = generateUniqueName('tweet')

      const tweet = await Tweet.create({
        content,
        userId: user.idUser,
        slug: slug,
      })

      if (slugImg) {
        await slugImg.move(app.makePath('public/medias'), {
          name: `${cuid()}.${slugImg.extname}`,
        })
        filePath = `medias/${slugImg?.fileName}`

        const tweetId = (tweet as any).idTweet
        await Media.create({
          url: filePath,
          tweetId,
        })
      }

      session.flash('success', 'Publié')
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('pubication echouer', error)
      session.flash('error', 'Vous ne pouvez pas faire de post pour le moment')
      return response.redirect().back()
    }
  }

  /**
   * Show individual record
   */
  async show({ params, view }: HttpContext) {
    const UserTweet = await Tweet.query().where('idTweet', params.id).preload('user').firstOrFail()

    return view.render('posts.show', { UserTweet })
  }

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
