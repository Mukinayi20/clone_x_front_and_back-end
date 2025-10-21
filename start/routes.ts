/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const LoginController = () => import('#controllers/login_controller')
const RegistersController = () => import('#controllers/registers_controller')
const ConnexionPagesController = () => import('#controllers/connexion_pages_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')
router.get('/login', [LoginController, 'login']).as('auth.login')
router.post('/login', [LoginController, 'handlelogin'])
router.get('/register', [RegistersController, 'register']).as('auth.register')
router.post('/register', [RegistersController, 'handleregister'])
router.get('/register/step2', [RegistersController, 'register2']).as('auth.register2')
router.post('/register/step2', [RegistersController, 'handleregister2'])
router.get('/connexion', [ConnexionPagesController, 'pageConnexion'])
