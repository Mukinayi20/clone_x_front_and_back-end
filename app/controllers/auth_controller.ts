import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
import {
  loginValidatorstep1,
  loginValidatorstep2,
  registerValidatorstep1,
  registerValidatorstep2,
} from '#validators/auth'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class RegistersController {
  // Inscription première étape

  async handleregister({ request, session, response }: HttpContext) {
    try {
      const { email, fullName, day, month, year } =
        await request.validateUsing(registerValidatorstep1)

      const parts = fullName.trim().split(/\s+/)
      const prenom = parts[0] || ''
      const nom = parts.slice(1).join('') || ''

      const birthday = new Date(`${year}-${month}-${String(day).padStart(2, '0')}`)
      if (Number.isNaN(birthday.getTime())) {
        session.flash('error', 'Date de naissance invalide')
        return response.redirect().back()
      }

      session.put('register.step1', {
        // expiresAt,
        // token,
        prenom,
        nom,
        birthday,
        email,
      })
      session.flash('success', 'Step 1 reussit')
      return response.redirect().toRoute('auth.register2')
    } catch (error) {
      console.error("vous n'avez pas fourni les information qu'il faut:", error)
      session.flash('error', 'Veuillez renseigner les champs demandés')
      return response.redirect().back()
    }
  }
  // Inscription deuxième étape

  async handleregister2({ request, session, response }: HttpContext) {
    try {
      const step1 = session.get('register.step1')
      if (!step1) {
        session.flash('error', 'Veuillez d’abord remplir la première étape.')
        return response.redirect().toRoute('auth.register')
      }
      const { password } = await request.validateUsing(registerValidatorstep2)

      const tokenMailSend = crypto.randomBytes(24).toString('hex')
      const expiresAt = DateTime.local().plus({ hours: 24 }).toISO()
      //const allstep = { ...step1, password }

      // const emailVerified = await User.findBy('email', step1.email)
      // if (emailVerified) {
      //   session.flash('error', 'Verifiez votre email')
      //   return response.redirect().toRoute('auth.register')
      // }
      try {
        await mail.send((message) => {
          message
            .to(step1.email)
            .from('arsenemukinayi20@gmail.com')
            .subject(`Verify your email address ${step1.prenom} ${step1.nom}`)
            .htmlView('emails/verify_email', {
              user: {
                prenom: step1.prenom,
                nom: step1.nom,
                email: step1.email,
                verification_token: tokenMailSend,
              },
            })
        })
      } catch (error) {
        console.error('erreur envoi email', error)
        session.flash('error', "Impossible d'envoyer l'email de confirmation")
        return response.redirect().back()
      }

      const user = await User.findBy('email', step1.email)
      if (!user || !user.verified) {
        session.flash('error', 'Veuillez vérifier votre email avant de vous connecter')
        return response.redirect().back()
      }
      session.put('register.step2', { password, expiresAt, tokenMailSend })
      // session.forget('register.step1')
      session.flash('success', 'Vous avez reçu un mail')
      return response.redirect().toRoute('auth.login')
    } catch (error) {
      console.error('mot de passe invalide', error)
      session.flash('error', 'Veuillez renseigner les champs demandés')
      return response.redirect().back()
    }
  }
  // Verification de la confirmation par adresse email

  async verifyEmail({ request, response, session }: HttpContext) {
    try {
      const step1 = session.get('register.step1')
      const step2 = session.get('register.step2')

      const token = request.input('token')
      const user = await User.findBy('verification_token', token)

      if (!step1 || !step2) {
        session.flash('error', 'Informations manquantes. Recommencez l’inscription.')
        return response.redirect().toRoute('auth.register')
      }

      if (token !== step2.token || DateTime.now() > DateTime.fromISO(step2.expiresAt)) {
        session.flash('error', 'Lien de vérification invalide ou expiré')
        return response.redirect().toRoute('auth.register')
      }

      await User.create({
        birthday: step1.birthday,
        email: step1.email,
        prenom: step1.prenom,
        nom: step1.nom,
        password: step2.password,
        verified: false,
        verification_token: step2.tokenMailSend,
        token_expires_at: step2.expiresAt,
      })

      if (!user) {
        session.flash('error', 'lien de verification invalide ou expirer')
        return response.redirect().toRoute('auth.register')
      }

      user.verified = true
      user.verification_token = null
      await user.save()

      session.forget('register.step1')
      session.forget('register.step2')
      session.flash('success', 'Adresse e-mail vérifiée avec succès !')
      return response.redirect().toRoute('auth.register2')
    } catch (error) {
      console.error('Email non valide', error)
      session.flash('error', 'vous avez entrez une adresse invalide')
      return response.redirect().toRoute('auth.register')
    }
  }
  // Connexion première étape

  async handleloginCheckEmail({ request, session, response }: HttpContext) {
    const data = await request.validateUsing(loginValidatorstep1)

    session.put('email_put', data)
    session.flash('success', 'email valide')
    return response.redirect().toRoute('auth.login2')
  }
  // connexion deuxième étape

  async handleloginCheckpassword({ request, session, response }: HttpContext) {
    session.get('email_put')
  }
}
