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
      'SELECT * FROM user_profiles WHERE IsAMatch(?, id)',
      [id],
      (error, results) => {
        if (error) throw error

        if (results[0] === undefined) return res.status(404).json({ data: 'Did not find any matches' })

        const returnObject = []

        results.forEach(result => {
          returnObject.push({ 
            username: result.username,
            bio: result.bio,
            games: JSON.parse(result.games),
            platforms: JSON.parse(result.platforms)
           })
        })

        return res.status(200).json({ data: returnObject })
      }
    )
  } catch (error) {
    return res.status(500)
    .json({ data: `Something went wrong, please try again` })
  }
}

exports.swipeOnUser = async (req, res) => {
  const { id } = req.user
  const otherUserId = req.body.otherUserId  
  const pool = await getPool()

  try {
    pool.query(
      'INSERT INTO swipes(sender_id, receiver_id, created_at) VALUES (?, ?, NOW())',
      [id, Number(otherUserId)],
      (error) => {
        if (error) throw error
        return res.status(200).json({ data: 'Swiped on user' })
      }
    )
  } catch (error) {
    return res.status(500)
    .json({ data: `Something went wrong, please try again` })
  }
}