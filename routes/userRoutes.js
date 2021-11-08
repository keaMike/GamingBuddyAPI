const router = require('express').Router()
const userController = require('../controllers/controllerSelector').controller('user')
const auth = require('../middleware/auth')

router.get('/', auth.protected, userController.getUsers)

router.get('/:id', auth.protected, require('../controllers/controllerSelector').controller('user').getUserById)

router.post('/signin', userController.signIn)

router.post('/signup', userController.signUp)

router.put('/addgametouser', auth.protected, userController.addGameToUser)

router.put('/addplatformtouser', auth.protected, userController.addPlatformToUser)

module.exports = router
