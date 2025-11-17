import { resetPasswordValidatorstep1, updateValidator } from '#validators/upload'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UpdatesController {
  async updateProfil({ request, auth, session, response }: HttpContext) {
    try {
      const { profil, couverture, fullname, bio, location } =
        await request.validateUsing(updateValidator)
      const user = auth.user!

      if (profil) {
        await profil.move(app.makePath('public/uploads'), {
          name: `${cuid()}.${profil.extname}`,
        })
      }
      const fileProfil = `uploads/${profil?.fileName}`
      // user.photo_profil = fileProfil

      if (couverture) {
        await couverture.move(app.makePath('public/uploads'), {
          name: `${cuid()}.${couverture.extname}`,
        })
      }
      const fileCouverture = `uploads/${couverture?.fileName}`
      console.log(fileCouverture, fileProfil)
      // user.photo_couverture = fileCouverture

      const fullNameSafe = fullname || ''
      const parts = fullNameSafe.trim().split(/\s+/)
      const prenom = parts[0] || ''
      const nom = parts.slice(1).join('') || ''

      user.merge({
        photo_profil: fileProfil ?? user.photo_profil,
        photo_couverture: fileCouverture ?? user.photo_couverture,
        prenom,
        nom,
        bio,
        adresse: location,
      })
      await user.save()

      console.log('User sauvegardé:', user.photo_couverture)
      session.flash('success', 'Vorte profil est mis à jour avec succes')
      return response.redirect().toRoute('home')
    } catch (error) {
      console.log("Erreur d'importation", error)
    }
  }

  async modificationPassword({ request, auth, session, response }: HttpContext) {
    try {
      const { password, confirmationPassword } = await request.validateUsing(
        resetPasswordValidatorstep1
      )

      if (password !== confirmationPassword) {
        session.flash('error', 'Vueillez saisir un mot de passe identique')
      }

      const user = auth.user!

      user.password = password
      await user.merge({ password }).save()

      console.log('nouveau mot de passe', user.password)
      session.flash('success', 'votre mot de passe est à jour')
      return response.redirect().back()
    } catch (error) {
      console.error('Erreur mot de passe ne peux pas changer', error)
      session.flash('error', 'Cette opération ne peux pas oboutir')
      return response.redirect().back()
    }
  }
}
