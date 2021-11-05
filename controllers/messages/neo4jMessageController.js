const neo4j = require('neo4j-driver')
const { driver } = require('../../database/neo4jConfig')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')

exports.sendMessage = (req, res) => {
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}

exports.getAllMessages = (req, res) => {
  // TODO implement
  return res.status(501).json({ data: 'Not yet implemented' })
}