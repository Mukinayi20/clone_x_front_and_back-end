import type { HttpContext } from '@adonisjs/core/http'

export default class ConnexionPagesController {
  pageConnexion({ view }: HttpContext) {
    return view.render('auth/home_connexion')
  }
}
