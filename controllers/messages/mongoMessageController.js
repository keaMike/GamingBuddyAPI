const repo = require('../../database/mongoRepo')
const ObjectId = require('mongodb').ObjectId
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')
const userCollection = 'users'
const swipeCollection = 'swipes'

exports.sendMessage = (req, res) => {
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}

exports.getAllMessages = (req, res) => {
  // TODO implement
  return res.status(501).json({ data: 'Not yet implemented' })
}