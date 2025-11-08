import User from '#models/user'
import { forgotPasswordValidatorstep, resetPasswordValidatorstep1 } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import Token from '#models/tokenn'
import mail from '@adonisjs/mail/services/main'

export default class ResetPasswordController {
  async handleForgotPassword({ request, response, session }: HttpContext) {
    try {
      const { email } = await request.validateUsing(forgotPasswordValidatorstep)
      const user = await User.findBy('email', email)

      if (!user) {
        session.flash('error', 'aucun compte associer à cette email')
        return response.redirect().toRoute('auth.login.email')
      }

      const token = crypto.randomBytes(24).toString('hex')
      const url = `http://localhost:3333/reset-password?token=${token}&email=${email}`
      //const expiresAt = DateTime.local().plus({ hours: 24 }).toISO()
      await Token.create({
        token,
        email: user?.email,
        expiriesAt: DateTime.now().plus({ minutes: 10 }),
      })
      try {
        await mail.send((message) => {
          message
            .to(user.email)
            .from('arsenemukinayi20@gmail.com')
            .subject(`Verify your email address`)
            .htmlView('emails/reste_email', { user: { user, url } })
        })
      } catch (error) {
        console.error('erreur envoi email', error)
        session.flash('error', 'Email non valide')
        return response.redirect().toRoute('auth.forgot-password')
      }

      session.flash('success', 'vous avez reçu un email')
      return response.redirect().toRoute('auth.forgot-password')
    } catch (error) {
      console.error('Une erreur de traitement amail', error)
      session.flash('error', "Une erreur s'est produit reveinez ulterieurement")
      return response.redirect().toRoute('home_connexion')
    }
  }

  async resetPassword({ request, session, response, view }: HttpContext) {
    try {
      const { email, token } = request.only(['email', 'token'])
      const tokenObje = await Token.findBy('token', token)

      if (
        !tokenObje ||
        !!tokenObje?.isUsed === true ||
        tokenObje?.email !== email ||
        DateTime.now() > tokenObje?.expiriesAt
      ) {
        session.flash('error', 'Lien expirer ou invalide')
        return response.redirect().toRoute('home_connexion')
      }

      return view.render('auth/reset_password', { token, email })
    } catch (error) {
      console.error("Une erreur s'est produite pendant la verification du token", error)
      session.flash('error', 'impossible de recuperer votre compte')
      return response.redirect().toRoute('home_connexion')
    }
  }

  async handleResetPassword({ request, session, response }: HttpContext) {
    try {
      const { email, password, token, confirmationPassword } = await request.validateUsing(
        resetPasswordValidatorstep1
      )
      if (password !== confirmationPassword) {
        session.flash('error', 'les mots de passes que vous avez saisis ne sont pas identique')
        return response.redirect().toRoute('auth/reset_password')
      }

      const tokenObje = await Token.findBy('token', token)
      if (
        !tokenObje ||
        !!tokenObje?.isUsed === true ||
        tokenObje?.email !== email ||
        DateTime.now() > tokenObje?.expiriesAt
      ) {
        session.flash('error', 'Lien expirer ou invalide')
        return response.redirect().toRoute('home_connexion')
      }

      const user = await User.findBy('email', email)
      if (!user) {
        session.flash('error', 'Oups votre, assurez vous de renseigner un email valide')
        return response.redirect().toRoute('home_connexion')
      }

      await tokenObje.merge({ isUsed: true }).save()
      await user.merge({ password }).save()

      session.flash('succes', 'mot de passe à jour')
      return response.redirect().toRoute('auth.login.email')
    } catch (error) {
      console.error('Quelque chose ne va pas', error)
      session.flash('error', "nous n'avons pas réussit a reinitialiser votre mot de passe")
      return response.redirect().toRoute('auth.forgot-password')
    }
  }
}
