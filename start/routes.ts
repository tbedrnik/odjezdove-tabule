/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    const RegisterController = () => import('#controllers/auth/register_controller')
    router.get('register', [RegisterController, 'show']).as('register.show').use(middleware.guest())
    router
      .post('register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())

    const LoginController = () => import('#controllers/auth/login_controller')
    router.get('login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    const LogoutController = () => import('#controllers/auth/logout_controller')
    router.post('logout', [LogoutController, 'handle']).as('logout.handle').use(middleware.auth())
  })
  .as('auth')

const BoardsController = () => import('#controllers/boards_controller')

router.resource('boards', BoardsController).use('*', middleware.auth())
