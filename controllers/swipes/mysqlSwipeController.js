const { getPool } = require('../../database/mysqlConfig')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../../utils/encryption')

exports.findMatches = async (req, res) => {
  const { id } = req.user
  const pool = await getPool()

  try {
    pool.query(
      'SELECT * FROM users WHERE IsAMatch(?, users_id)',
      [id],
      (error, results) => {
        if (error) throw error
        return res.status(200).json({ data: results })
      }
    )
  } catch (error) {
    return res.status(500)
    .json({ data: `Something went wrong, please try again` })
  }
}

exports.swipeOnUser = async (req, res) => {
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}