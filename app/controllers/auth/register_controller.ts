import User from '#models/user'
import { registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async show({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  async store({ request, response }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(registerValidator)

    await User.create({ fullName, email, password })

    return response.redirect('/login')
  }
}
