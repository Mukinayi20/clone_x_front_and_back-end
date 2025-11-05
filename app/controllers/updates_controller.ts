import { updateValidator } from '#validators/upload'
import type { HttpContext } from '@adonisjs/core/http'

export default class UpdatesController {
  async updateProfil({ request }: HttpContext) {
    try {
      //const payload = await request.validateUsing(updateValidator)
      // TODO: Use payload data here
      const allfiles = await request.files('file')
      for (let files of allfiles) {
        console.log(files)
      }
    } catch (error) {}
  }
}
