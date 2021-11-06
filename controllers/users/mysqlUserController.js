const { response } = require('express')
const { getPool } = require('../../database/mysqlConfig')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../../utils/encryption')

exports.getUsers = async (req, res) => {
  const ownId = req.user.id
  const { skip } = req.query
  const pool = await getPool()
  try {
    pool.query(
      `
      SELECT * FROM user_profiles
      WHERE id != ?
      ORDER BY id ASC
      LIMIT 10
      OFFSET ?
    `,
      [ownId, Number(skip)],
      (error, results) => {
        if (error) throw error
        console.log(JSON.parse(results[0].games))
        console.log(JSON.parse(results[0].platforms))
        return res.status(200).json({ data: results })
      }
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.getUserById = async (req, res) => {
  const { id } = req.params
  const pool = await getPool()
  try {
    pool.query(
      `
      SELECT * FROM user_profiles
      WHERE id = ?
    `,
      [id],
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

exports.getOwnUser = async (req, res) => {
  const { id } = req.user.id
  const pool = await getPool()
  try {
    pool.query(
      `
      SELECT 
        user_id AS id,
        username,
        email,
        bio
      FROM users
      WHERE id = ?
    `,
      [id],
      (error, results) => {
        if (error) throw error
        return res.status(200).json({ data: results })
      }
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.signUp = async (req, res) => {
  const { username, email, password, bio } = req.body
  const pool = await getPool()

  if (!username || !email || !password) {
    return res.status(400).json({ data: 'Please fill all fields' })
  }

  try {
    pool.query(
      `
      SELECT users_id AS id FROM users
      WHERE email = ? OR username = ?
    `,
      [email, username],
      async (error, result) => {
        if (error) throw error
        if (result[0]?.id) {
          return res
            .status(400)
            .json({ data: 'User with that email or username already exists' })
        } else {
          const hash = await hashPassword(password)
          pool.query(
            `
        INSERT INTO users (username, email, password, bio)
        VALUES(?,?,?,?)
    `,
            [username, email, hash, bio],
            (error) => {
              if (error) throw error
              return res
                .status(201)
                .json({ data: 'Your account has been created' })
            }
          )
        }
      }
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body
  const pool = await getPool()

  if (!email || !password) {
    return res.status(404).json({ data: 'Please fill you both fields' })
  }

  try {
    pool.query(
      `
            SELECT 
                users_id AS id,
                username,
                email,
                password,
                bio 
            FROM users
            WHERE email = ?
        `,
      [email],
      async (error, result) => {
        if (error) throw error
        const user = result[0]
        const hash = user.password
        if (hash) {
          const isValid = await verifyPassword(password, hash)
          if (isValid) {
            delete user.password
            const token = await signToken(user.id)
            return res.status(200).json({ token, user })
          }
        } else {
          return res.status(400).json({ data: 'Email has not been registered' })
        }
      }
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.addGameToUser = async (req, res) => {
  const { id } = req.user
  const game = req.body.game
  const pool = getPool()

  try {
    pool.query(
      'INSERT INTO users_games (user_id, game_id, platform_id, rank, comment) ' +
      'VALUES (?, ?, ?, ?, ?)',
      [id, game.gameId, game.platformId, game.rank, game.comment],
      (error, results) => {
        if (error) throw error
        return res.status(201).json({ data: 'Game added' })
      }
      )
  } catch (error) {
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.addPlatformToUser = async (req, res) => {
  const { id } = req.user
  const platform = req.body.platform
  const pool = getPool()

  try {
    pool.query(
      'INSERT INTO users_platforms (user_id, platform_id, gamertag) ' +
      'VALUES (?, ?, ?)',
      [id, platform.platformId, platform.gamertag],
      (error, results) => {
        if (error) throw error
        return res.status(201).json({ data: 'Platform added' })
      }
      )
  } catch (error) {
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}