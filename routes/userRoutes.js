const router = require('express').Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.get('/', auth.protected, userController.getUsers)

router.get('/:id', auth.protected, userController.getUserById)

router.post('/signin', userController.signIn)

router.post('/signup', userController.signUp)

module.exports = router
