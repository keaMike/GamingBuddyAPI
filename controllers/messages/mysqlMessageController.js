const { getPool } = require('../../database/mysqlConfig')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../../utils/encryption')

exports.sendMessage = async (req, res) => {
    const ownId = req.user.id
    const receiverId = req.body.receiverId
    const content = req.body.content
    const pool = await getPool()

    try {
      pool.query(
        `INSERT INTO messages (
            sending_user_id,
            receiving_user_id,
            content,
            created_at) VALUES 
            (?, ?, ?, NOW())`,
            [ownId, receiverId, content],
            (error) => {
                if (error) throw error
                return res.status(200).json({ data: 'Message sent' })
            }
      )
    } catch (error) {
      console.log(error)
      return res.status(500)
      .json({ data: 'Something went wrong, please try again' })
    }
}

exports.getAllMessages = async (req, res) => {
  const { id } = req.user
  const pool = await getPool()
  
  try {
    pool.query(
      `SELECT sending_user_id, receiving_user_id, content, created_at FROM messages WHERE receiving_user_id = ? 
      OR sending_user_id = ? ORDER BY created_at`,
      [id, id],
      (error, results) => {
        if (error) throw error
        return res.status(200).json({ data: results })
      }
      )
  } catch (error) {
    console.log(error)
      return res.status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}