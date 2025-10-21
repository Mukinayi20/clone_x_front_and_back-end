import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  login({ view }: HttpContext) {
    return view.render('auth/login_modal')
  }

  async handlelogin({}: HttpContext) {}
}
