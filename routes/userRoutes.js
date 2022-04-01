const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')

// might need to build it up from the bottom with passport auth in mind, this is fkn messy

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(issuer, profile, cb) => {
  const email = profile.emails[0].value
  const id = profile.id
  const username = profile.displayName

  
  userController.signInProcess(email, id, (success, error, statusCode) => {
    if (success) {
      console.log('first try')
      cb(JSON.stringify({ data: success }))
    } else {
      userController.signUpProcess(username, email, id, '', (success, error, statusCode) => {
        if (success) {
          userController.signInProcess(email, id, (success, error, statusCode) => {
            console.log('second try')
            cb(JSON.stringify({ data: success }))
          })
        } else {
          cb(JSON.stringify({ data: error }))
        }
      })
    }
  })
  


  
}
));

router.get('/', auth.protected, userController.getUsers)

router.get('/failed', (req, res) => {
  console.log(req.session)
  res.send('you failed!')
})

router.get('/:id', auth.protected, userController.getUserById)

router.post('/signin', userController.signIn)

router.get('/signin/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }))

router.get('/signin/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/api/users/failed', failureMessage: true }),
  (req, res) => {
    res.redirect('/api/users/')
  }
)

router.post('/signup', userController.signUp)

router.put('/addgametouser', auth.protected, userController.addGameToUser)

router.put('/addplatformtouser', auth.protected, userController.addPlatformToUser)

module.exports = router
