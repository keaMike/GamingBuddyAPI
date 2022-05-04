const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.get('/', auth.protected, userController.getUsers)

router.post('/signin', userController.signIn) // TODO validate with https://www.npmjs.com/package/joi

router.post('/signup', userController.signUp)

router.put('/addgametouser', auth.protected, userController.addGameToUser)

router.put(
  '/addplatformtouser',
  auth.protected,
  userController.addPlatformToUser
)

router.get('/own', auth.protected, userController.getOwnUser)

router.get('/:id', auth.protected, userController.getUserById)

module.exports = router
