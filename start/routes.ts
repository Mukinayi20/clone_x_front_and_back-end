/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegistersController = () => import('#controllers/auth_controller')
const UpdateController = () => import('#controllers/updates_controller')
const PostController = () => import('#controllers/post_controller')
const resetPasswordController = () => import('#controllers/reset_password_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import type { HttpContext } from '@adonisjs/core/http'
router
  .get('/', async ({ auth, view }: HttpContext) => {
    return view.render('pages/home', {
      user: auth.user,
    })
  })
  .as('home')
  .use(middleware.auth())

//router.get('/', [PostController, 'index'])

// Vue modal login step1 email

router
  .get('/login-email', async ({ view }) => {
    return view.render('auth/login_step1')
  })
  .as('auth.login.email')
  .use(middleware.guest())

// Vue modal login step2 password

router
  .get('/login-password', async ({ session, view }: HttpContext) => {
    return view.render('auth/login_step2', {
      user: session.get('email_put'),
    })
  })
  .as('auth.login.password')
  .use(middleware.guest())

// Vue modal register step1

router
  .get('/register', ({ view }) => {
    return view.render('auth/register_modal')
  })
  .as('auth.register')
  .use(middleware.guest())

// Vue modal register step2

router
  .get('/register/step2', ({ view }) => {
    return view.render('auth/register_modal_2')
  })
  .as('auth.register2')
  .use(middleware.guest())

// Vue page de connexion

router
  .get('/connexion', ({ view }) => {
    return view.render('auth/connexion')
  })
  .as('home_connexion')
  .use(middleware.guest())

// La route pour la validation de l'inscription par email

router.get('/verifyEmail', [RegistersController, 'verifyEmail']).as('auth.verify.email')

// Page d'atente de la confirmation par email

router
  .get('wait_mail', ({ view }) => {
    return view.render('emails/send_email')
  })
  .as('wait.validate.mail')
  .use(middleware.guest())
// Page de reinitialisation du mot de passe
router
  .get('forget-password', ({ view }) => {
    return view.render('auth/forget_password')
  })
  .as('forgot.passeword')
  .use(middleware.guest())

router
  .get('/reset-password', [resetPasswordController, 'resetPassword'])
  .as('auth.reset-password')
  .use(middleware.guest())

router
  .get('/editer-profil', async ({ view, auth }) => {
    return view.render('component/editerProfil', {
      user: auth.user,
    })
  })
  .as('edit.profil')
  .use(middleware.auth())

router
  .post('/forget-password', [resetPasswordController, 'handleForgotPassword'])
  .as('auth.forgot-password')
  .use(middleware.guest())

router
  .post('/reset-password', [resetPasswordController, 'handleResetPassword'])
  .as('auth.handleReset-password')
  .use(middleware.guest())
router.post('/register', [RegistersController, 'handleregister']).use(middleware.guest())
router.post('/register/step2', [RegistersController, 'handleregister2']).use(middleware.guest())
router.post('/login-email', [RegistersController, 'handleloginCheckEmail']).use(middleware.guest())
router
  .post('/login-password', [RegistersController, 'handleloginCheckpassword'])
  .use(middleware.guest())
router.delete('/logout', [RegistersController, 'logout']).as('auth.logout').use(middleware.auth())
router.post('/update-profil', [UpdateController, 'updateProfil']).use(middleware.auth())
router
  .post('/modificatio-password', [UpdateController, 'modificationPassword'])
  .as('auth.modify-password')
  .use(middleware.auth())

router.get('/post-creat', [PostController, 'create']).as('post.creat').use(middleware.auth())
router.post('/post-creat', [PostController, 'store']).use(middleware.auth())
router
  .get('/post/:id', [PostController, 'show'])
  .as('post.show')
  .use(middleware.auth())
  .where('id', router.matchers.number())

router
  .post('/tweets/:id/like', [PostController, 'like'])
  .use(middleware.auth())
  .where('id', router.matchers.number())

// router
//   .get('/accueil', async ({ auth, view }: HttpContext) =>
//     view.render('layout/accueils/acceuil', { user: auth.user })
//   )
//   .use(middleware.auth())
//   .as('accueil')

router.get('/accueil', [PostController, 'index']).use(middleware.auth()).as('accueil')

router
  .get('/grok', async ({ auth, view }: HttpContext) =>
    view.render('layout/grok', { user: auth.user })
  )
  .use(middleware.auth())
router
  .get('/signet', async ({ auth, view }: HttpContext) =>
    view.render('layout/signet', { user: auth.user })
  )
  .use(middleware.auth())
router
  .get('/profil', async ({ auth, view }: HttpContext) => {
    const user = auth.user
    return view.render('layout/profils/profil', { user })
  })
  .use(middleware.auth())
