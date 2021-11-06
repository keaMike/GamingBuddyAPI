const router = require('express').Router()
const messageController = require('../controllers/controllerSelector').controller('message');
const auth = require('../middleware/auth')

router.get('/messages', auth.protected, messageController.getAllMessages)

router.post('/message', auth.protected, messageController.sendMessage)

module.exports = router