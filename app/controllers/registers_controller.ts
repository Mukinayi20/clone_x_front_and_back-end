import User from '#models/user'
import { registerUserValidatorstep1 } from '#validators/auth_step1_validator'
import { registerUserValidatorstep2 } from '#validators/auth_step_2'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegistersController {
  register({ view }: HttpContext) {
    return view.render('auth/register_modal')
  }

  register2({ view }: HttpContext) {
    return view.render('auth/register_modal_2')
  }

  async handleregister({ request, session, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerUserValidatorstep1)

      const fullName = request.input('fullName')
      const parts = fullName.trim().split(/\s+/)
      const prenom = parts[0] || ''
      const nom = parts.slice(1).join('') || ''

      //Construire la date à partir des 3 selects
      const day = request.input('day')
      const month = request.input('month')
      const year = request.input('year')
      if (!day || !month || !year) {
        session.flash('error', 'Veuillez sélectionner votre date de naissance complète')
        return response.redirect().back()
      }
      const birthday = new Date(`${year}-${month}-${String(day).padStart(2, '0')}`)
      if (Number.isNaN(birthday.getTime())) {
        session.flash('error', 'Date de naissance invalide')
        return response.redirect().back()
      }

      session.put('register.step1', {
        prenom,
        nom,
        birthday,
        email: data.email,
      })
      session.flash('success', 'Step 1 reussit')
      return response.redirect().toRoute('auth.register2')
    } catch (error) {
      console.error("vous n'avez pas fourni les information qu'il faut:", error)
      session.flash('error', 'une erreur est survenu')
      return response.redirect().back()
    }
  }
  async handleregister2({ request, session, response }: HttpContext) {
    try {
      const step1 = session.get('register.step1')
      if (!step1) {
        session.flash('error', 'Veuillez d’abord remplir la première étape.')
        return response.redirect().toRoute('auth.register')
      }
      const { password } = await request.validateUsing(registerUserValidatorstep2)
      if (!password) {
        session.flash('error', 'veiller entrer un mot de passe')
        return response.redirect().back()
      }
      const allstep = { ...step1, password }

      console.log(allstep)

      await User.create(allstep)
      session.forget('register.step1')
      session.flash('success', 'Inscription réussit')
      return response.redirect().toRoute('auth.login')
    } catch (error) {
      console.error('mot de passe invalide', error)
      session.flash('error', 'Une erreur est survenu')
      return response.redirect().back()
    }
  }
}
