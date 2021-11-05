const { getPool } = require('../../database/mysqlConfig')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../../utils/encryption')

exports.findMatches = async (req, res) => {
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}

exports.swipeOnUser = async (req, res) => {
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}