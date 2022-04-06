const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oidc')

const {
  getUserByEmail,
  getOwnUserProcess,
  updateLastLogin,
  findCredentials,
  addCredentials,
  signUpProcess
} = require('../controllers/userController')

const {
  verifyPassword,
} = require('../utils/encryption')

exports.localStrategy = new LocalStrategy(async (username, password, cb) => {
  await getUserByEmail(username, async (user) => {
    if (!user) return cb(null, false, { message: 'Incorrect email' })

    const hash = user.password
    const isValid = await verifyPassword(password, hash)
    if (isValid) {
      delete user.password

      updateLastLogin(user.id)

      return cb(null, user)
    } else {
      return cb(null, false, { data: 'Something went wrong, please try again' })
    }
  });
})

exports.googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
(issuer, profile, cb) => {
  const email = profile.emails[0].value
  const id = profile.id
  const username = profile.displayName

  findCredentials(issuer, id, (result) => {
    if (!result[0]) {
      signUpProcess(username, email, null, '', true, (success, error, statusCode) => {
        if (error) return cb(null, false, { data: 'Something went wrong, please try again' })

        addCredentials(success.id, issuer, id, (result) => {
          if (!result) {
            return cb(null, false, { data: 'Something went wrong, please try again' })
          } else {
            const user = {
              id: success.id,
              email: email,
              username: username,
            }
            return cb(null, user)
          }
        })
      })
    } else {
      getOwnUserProcess(result[0].user_id, (success, error, statusCode) => {
        if (error) return cb(null, false, { data: 'Something went wrong, please try again' })

        return cb(null, success[0])
      })
    }
  })
}
)