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
import hash from '@adonisjs/core/services/hash'

export default class RegistersController {
  // ********************************************Inscription première étape

  async handleregister({ request, session, response }: HttpContext) {
    try {
      const { email, fullName, day, month, year } =
        await request.validateUsing(registerValidatorstep1)

      // ****************************************Destructuration du fullname

      const parts = fullName.trim().split(/\s+/)
      const prenom = parts[0] || ''
      const nom = parts.slice(1).join('') || ''

      // *****************************************Logique de la date de naissance

      const birthday = new Date(`${year}-${month}-${String(day).padStart(2, '0')}`)
      if (Number.isNaN(birthday.getTime())) {
        session.flash('error', 'Date de naissance invalide')
        return response.redirect().back()
      }

      // ****************************************Enregistrement dans la première session de l'enregistrement

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
  // ***********************************************Inscription deuxième étape

  async handleregister2({ request, session, response }: HttpContext) {
    try {
      // *******************************************Condition pour passer a la dernière étape de l'iscription

      const step1 = session.get('register.step1')
      if (!step1) {
        session.flash('error', 'Veuillez d’abord remplir la première étape.')
        return response.redirect().toRoute('auth.register')
      }
      const { password } = await request.validateUsing(registerValidatorstep2)

      // *********************************************Clé pour la validation par mail

      const tokenMailSend = crypto.randomBytes(24).toString('hex')
      const expiresAt = DateTime.local().plus({ hours: 24 }).toISO()

      const hashTokenMailSend = await hash.make(tokenMailSend)

      session.put('register.pendingVerification', {
        ...step1,
        password,
        token: hashTokenMailSend,
        tokenMailSend,
        expiresAt,
      })

      // *********************************************** Envoie du mail à l'inscription du user

      const url = `http://localhost:3333/verifyEmail?token=${tokenMailSend}&email=${encodeURIComponent(step1.email)}`

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
                url,
              },
            })
        })
      } catch (error) {
        console.error('erreur envoi email', error)
        session.flash('error', 'Email non valide')
        return response.redirect().toRoute('auth.register')
      }

      // session.put('register.step2', { password, expiresAt, hashTokenMailSend })
      // session.forget('register.step1')
      session.flash('success', 'Vous avez reçu un mail')
      return response.redirect().toRoute('wait.validate.mail')
    } catch (error) {
      console.error('mot de passe invalide', error.messages || error)
      session.flash('error', 'Veuillez renseigner les champs demandés')
      return response.redirect().toRoute('auth.register')
    }
  }

  // *************************************************** Verification de la confirmation par adresse email

  async verifyEmail({ request, response, session }: HttpContext) {
    // *************Si l'utilisateur de valide pas l'iscription via le mail qui lui était fournis il ne sera pas enregistrer

    try {
      console.log('Début des verification')
      const pending = session.get('register.pendingVerification')
      // const step2 = session.get('register.step2')

      const token = request.input('token')
      const email = request.input('email')
      console.log('token reçu', token)
      console.log('email reçu', email)

      if (!pending) {
        console.log('Erreur: pendig verification manque à la session')
        session.flash('error', 'Informations manquantes. Recommencez l’inscription.')
        return response.redirect().toRoute('auth.register')
      }

      if (pending.email !== email) {
        console.log('Erreur: Email dans le lien ne correspond pas à celui de la session')
        session.flash('error', 'Email de vérification ne correspond pas.')
        return response.redirect().toRoute('auth.register')
      }

      const existingUser = await User.findBy('email', pending.email)
      if (existingUser) {
        session.flash('error', 'oupsss!')
        return response.redirect().toRoute('auth.register')
      }
      // Verification de la clé reçu dans l'email et la clé qui est en local aussi du temps de la validité du message de confirmation
      const tokenVerifiedHash = await hash.verify(pending.token, token)

      console.log('tokenVerifiedHash:', tokenVerifiedHash)
      console.log('Expiration:', DateTime.now() > DateTime.fromISO(pending.expiresAt))

      if (!tokenVerifiedHash || DateTime.now() > DateTime.fromISO(pending.expiresAt)) {
        session.flash('error', 'Lien de vérification invalide ou expiré')
        return response.redirect().toRoute('auth.register')
      }
      // Après toutre les verificatioon effectuer l'utilisateur a un espace dans la base des donnée

      const userCreate = await User.create({
        birthday: pending.birthday,
        email: pending.email,
        prenom: pending.prenom,
        nom: pending.nom,
        password: pending.password,
        verified: true,
        verification_token: pending.tokenMailSend,
        token_expires_at: pending.expiresAt,
      })

      userCreate.verification_token = null
      await userCreate.save()

      if (!userCreate.verified) {
        session.flash('error', 'Vous devez reprendre votre inscription')
        return response.redirect().toRoute('auth.register')
      }

      session.forget('register.step1')
      session.forget('register.step2')
      session.flash('success', 'Adresse e-mail vérifiée avec succès !')
      console.log('-> Fin de verifyEmail, utilisateur créé/vérifié')
      return response.redirect().toRoute('auth.login.email')
    } catch (error) {
      console.error('Email non valide', error)
      session.flash('error', 'vous avez entrez une adresse invalide')
      return response.redirect().toRoute('auth.register')
    }
  }
  // **************************************************************Connexion première étape

  async handleloginCheckEmail({ request, session, response }: HttpContext) {
    try {
      const { email } = await request.validateUsing(loginValidatorstep1)

      session.put('email_put', email)
      session.flash('success', 'email valide')
      return response.redirect().toRoute('auth.login.password')
    } catch (error) {
      console.error('Une erreur est survenu', error)
      session.flash('error', 'Verifier les information que vous avez fournis')
      return response.redirect().back()
    }
  }
  // **************************************************************connexion deuxième étape

  async handleloginCheckpassword({ request, auth, session, response }: HttpContext) {
    const email = session.get('email_put')

    try {
      const { password } = await request.validateUsing(loginValidatorstep2)
      const user = await User.verifyCredentials(email, password)

      if (!user.verified) {
        session.flash('error', 'Veuillez vérifier votre email avant de vous connecter')
        return response.redirect().toRoute('auth.login.email')
      }

      auth.use('web').login(user)

      session.flash('success', 'connexion succes !')
      response.redirect().toRoute('home')
    } catch (error) {
      console.error('Verifiez vos information', error)
      session.flash('error', 'email ou mot de passe incorrect')
      return response.redirect().toRoute('auth.login.email')
    }
  }
}
