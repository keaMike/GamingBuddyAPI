const router = require('express').Router()
const passport = require('passport')

const {
  localStrategy,
  googleStrategy,
} = require('../controllers/loginController')

router.get('/failed', (req, res) => {
  res.send(`you failed!`)
})

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(localStrategy)

router.post('/password', 
  passport.authenticate('local', { failureRedirect: '/api/login/failed', failureMessage: true }), 
  (req, res) => {
    const user = req.user
    req.session.user = user
    res.redirect(process.env.AUTH_REDIRECT)
})

passport.use(googleStrategy);

router.get('/google', passport.authenticate('google', { scope: [ 'profile', 'email' ] }))

router.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/api/login/failed', failureMessage: true }),
  (req, res) => {
    const user = req.user
    req.session.user = user
    res.redirect(process.env.AUTH_REDIRECT)
  }
)

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.send({ data: 'logged out' })
})

module.exports = router