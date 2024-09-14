/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home', { version: 6 })

const TablesController = () => import('#controllers/tables_controller')

router.get('table', [TablesController, 'index'])
