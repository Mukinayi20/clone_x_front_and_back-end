import fs from 'node:fs/promises'
import Like from '#models/like'
import Media from '#models/media'
import Signet from '#models/signet'
import Tweet from '#models/tweet'
import { storePostValidator, updatePostValidator } from '#validators/post'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { unlink } from 'node:fs/promises'
import path from 'node:path'
import { alterTweet } from '#abilities/main'
import TweetPolicy from '#policies/tweet_policy'

export default class PostController {
  /**
   * Display a list of resource
   */
  async like({ auth, params, response }: HttpContext) {
    const tweetId = params.id
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    const userId = user.idUser

    const existingLike = await Like.query()
      .where('users_id', userId)
      .where('tweets_id', tweetId)
      .first()

    const tweets = await Like.find(tweetId)
    if (!tweets) {
      return response.notFound({ message: 'Tweet non trouvé' })
    }

    if (existingLike) {
      await existingLike.delete()
      tweets.likesCount = (tweets.likesCount || 0) - 1
      await tweets.save()

      return response.json({
        message: 'Like retiré avec succès',
        liked: false,
        likesCount: tweets.likesCount,
      })
    } else {
      await Like.create({ idUser: userId, idTweet: tweetId })
      const tweet = await Tweet.find(tweetId)
      if (tweet && typeof tweet.idTweet === 'number') {
        tweet.idTweet = tweet.idTweet + 1
        await tweet.save()

        return response.json({
          message: 'Tweet liké avec succès',
          liked: true,
          likesCount: tweet.idTweet,
        })
      }
    }
  }

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
  async show({ params, view }: HttpContext) {
    const UserTweet = await Tweet.query().where('idTweet', params.id).preload('user').firstOrFail()

    return view.render('posts.show', { UserTweet })
  }

  /**
   * Edit individual record
   */
  async edit({ params, view, bouncer, response, session }: HttpContext) {
    const { id } = params
    const tweet = await Tweet.query().where('idTweet', params.id).preload('medias').firstOrFail()
    if (await bouncer.with(TweetPolicy).denies('alterPost', tweet)) {
      session.flash('error', "Vous ne pouver pas modifier ce poste parce qu'il n'est pas à vous")
      return response.redirect().back()
    }
    return view.render('component/edite_tweet', { tweet })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session, bouncer }: HttpContext) {
    const { id } = params
    const tweet = await Tweet.query().where('idTweet', id).preload('medias').firstOrFail()
    if (await bouncer.denies(alterTweet, tweet)) {
      session.flash('error', "Vous ne pouver pas modifier ce poste parce qu'il n'est pas à vous")
      return response.redirect().back()
    }
    const { content, slugImg } = await request.validateUsing(updatePostValidator)
    let newFilePath: string | undefined
    let currentMedia = tweet.medias.length > 0 ? tweet.medias[0] : null
    try {
      if (tweet.content !== content) {
        tweet.merge({ content })
        await tweet.save()
      }

      if (slugImg) {
        if (currentMedia && currentMedia.url) {
          const oldPath = app.makePath('public', currentMedia.url)
          try {
            await fs.access(oldPath) // Vérifie si le fichier existe
            await fs.unlink(oldPath) // Supprime le fichier
            console.log('Ancienne image supprimée :', oldPath)
          } catch (deleteError) {
            // Ignorer si le fichier n'existe déjà pas (ENOENT)
            if (deleteError.code !== 'ENOENT') {
              console.error("Erreur lors de la suppression de l'ancienne image :", deleteError)
              // Décidez si vous voulez lancer l'erreur ou continuer. Pour l'instant, on log et on continue.
            }
          }
        }
        const newFileName = `${cuid()}.${slugImg.extname}`
        newFilePath = `medias/${newFileName}` // Chemin relatif à 'public'
        await slugImg.move(app.makePath('public/medias'), {
          // Assurez-vous que le répertoire cible est public/medias
          name: newFileName,
        })
        console.log('Nouvelle image téléchargée :', newFilePath)

        if (currentMedia) {
          currentMedia.url = newFilePath
          await currentMedia.save()
        } else {
          await tweet.related('medias').create({
            url: newFilePath,
          })
        }
      }

      await tweet.save()
      session.flash('success', 'le tweet est à jour')
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('Une erreur est survenu lors de la mise à jour du tweet', error)
      session.flash('error', "le tweet n'est pas à jour vueiller reprendre")
      return response.redirect().back()
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, session, response, bouncer }: HttpContext) {
    const { id } = params
    const tweet = await Tweet.query().where('idTweet', id).preload('medias').firstOrFail()
    if (await bouncer.denies(alterTweet, tweet)) {
      session.flash('error', "Vous ne pouver pas supprimer ce poste parce qu'il n'est pas à vous")
      return response.redirect().back()
    }
    try {
      if (tweet.medias.length > 0) {
        let oldImg = tweet.medias[0].url
        if (oldImg) {
          oldImg = oldImg.replace(/^public\//, '')
          if (!oldImg.startsWith('medias/')) {
            oldImg = `medias/${oldImg}`
          }
          const oldPath = app.makePath('public', oldImg)
          console.log('DELETE PATH =', oldPath)
          await fs.access(oldPath)
          await fs.unlink(oldPath)
        }
      }
      await tweet.delete()
      session.flash('success', 'le tweet est supprimé')
      return response.redirect().toRoute('home')
    } catch (error) {
      console.error('Une erreur est survenu lors de la mise à jour du tweet', error)
      session.flash('error', "le tweet n'est pas à jour vueiller reprendre")
      return response.redirect().back()
    }
  }
}
