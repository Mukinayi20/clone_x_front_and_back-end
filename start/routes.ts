/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegistersController = () => import('#controllers/auth_controller')
const ConnexionPagesController = () => import('#controllers/connexion_pages_controller')
import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')
// Vue modal login step1 email
router
  .get('/login-email', async ({ view }) => {
    return view.render('auth/login_modal')
  })
  .as('auth.login')
// Vue modal login step2 password
router
  .get('/login-password', async ({ view }) => {
    return view.render('auth/login_step2')
  })
  .as('auth.login2')
// Vue modal register step1
router
  .get('/register', ({ view }) => {
    return view.render('auth/register_modal')
  })
  .as('auth.register')
// Vue modal register step2
router
  .get('/register/step2', ({ view }) => {
    return view.render('auth/register_modal_2')
  })
  .as('auth.register2')
// Vue page de connexion
router
  .get('/connexion', ({ view }) => {
    return view.render('auth/home_connexion')
  })
  .as('home_connexion')
// La route pour la validation de l'inscription par email
router
  .get('/verify-email', ({ view }) => {
    return view.render('emails/verify_email')
  })
  .as('auth.verify')

router.post('/register', [RegistersController, 'handleregister'])
router.post('/register/step2', [RegistersController, 'handleregister2'])
router.post('/login', [RegistersController, 'handleloginCheckEmail'])
router.post('/login-password', [RegistersController, 'handleloginCheckpassword'])
