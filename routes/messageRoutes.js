const router = require('express').Router()
const messageController = require('../controllers/messageController')
const auth = require('../middleware/auth')

router.get('/', auth.protected, messageController.getAllMessages)

router.post('/', auth.protected, messageController.sendMessage)

module.exports = router