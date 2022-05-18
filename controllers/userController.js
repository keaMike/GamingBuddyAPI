const { v4: uuidv4 } = require('uuid')
const { getPool } = require('../database/mysqlConfig')
const { findUsersSwipedOn } = require('./swipeController')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../utils/encryption')

exports.getUsers = async (req, res) => {
  const ownId = req.user.id
  const { platform, game } = req.query
  const skip = req.query.skip ? req.query.skip : 0
  const limit = req.query.limit ? req.query.limit : 500
  const pool = await getPool()

  try {
    await findUsersSwipedOn(ownId, (ids) => {
      let idString = ''

      if (ids.length > 0) {
        ids.map((id) => {
          idString = idString + `'${id}',`
        })
        idString = idString.slice(0, idString.length - 1)
      }

      pool.query(
        `
          SELECT * FROM user_profiles
          LEFT JOIN users_games ug ON ug.user_id = id
          LEFT JOIN games g ON g.games_id = ug.game_id
          LEFT JOIN users_platforms up ON up.user_id = id
          LEFT JOIN platforms p ON p.platform_id = up.platform_id
          WHERE id != ?
          ${ids.length > 0 ? `AND id NOT IN (${idString})` : ''}
          ${
            platform && platform !== 'null'
              ? `AND p.platformName = '${platform}'`
              : ''
          }
          ${game && game !== 'null' ? `AND g.name = '${game}'` : ''}
          ORDER BY id ASC
          LIMIT ?
          OFFSET ?
        `,
        [ownId, Number(limit), Number(skip)],
        (error, results) => {
          const returnObject = []

          if (!results) return res.status(200).json({ data: [] })
          results.forEach((result) => {
            returnObject.push({
              id: result.id,
              bio: result.bio,
              username: result.username,
              games: JSON.parse(result.games),
              platforms: JSON.parse(result.platforms),
            })
          })

          if (error) throw error
          return res.status(200).json({ data: returnObject })
        }
      )
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: `Something went wrong, please try again. ${error}` })
  }
}

exports.getUsersFromIds = async (idArray, callback) => {
  if (idArray.length === 0) {
    callback([])
    return
  }

  const pool = await getPool()
  let idString = ''

  idArray.map((id) => {
    idString = idString + `'${id}',`
  })
  idString = idString.slice(0, idString.length - 1)

  try {
    pool.query(
      `SELECT * FROM user_profiles WHERE id IN (${idString})`, //TODO throws error when empty
      (error, results) => {
        if (error) throw error

        const returnArray = []

        results.map((result) => {
          returnArray.push({
            id: result.id,
            username: result.username,
            bio: result.bio,
            games: JSON.parse(result.games),
            platforms: JSON.parse(result.platforms),
          })
        })

        callback(returnArray)
      }
    )
  } catch (error) {
    console.log(error)
    return null
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

        if (results[0] === undefined)
          return res.status(404).json({ data: 'Could not find user' })

        const resultObject = results[0]
        const returnObject = {
          bio: resultObject.bio,
          username: resultObject.username,
          games: JSON.parse(resultObject.games),
          platforms: JSON.parse(resultObject.platforms),
        }

        return res.status(200).json({ data: returnObject })
      }
    )
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.getOwnUser = async (req, res) => {
  const id = req.user.id
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
        const user = {
          id: results[0].id,
          bio: results[0].bio,
          username: results[0].username,
          games: JSON.parse(results[0].games) || [],
          platforms: JSON.parse(results[0].platforms) || [],
        }
        return res.status(200).json({ data: user })
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
    pool.getConnection(async (error, connection) => {
      connection.beginTransaction(async (error) => {
        if (error) throw error

        const id = uuidv4()
        const hash = await hashPassword(password)
        let status = false

        connection.query(
          `INSERT IGNORE INTO users ` +
            `(users_id, username, email, password, bio, created_at) ` +
            `VALUES (?, ?, ?, ?, ?, NOW()); `,
          [id, username, email, hash, bio],
          (error, results) => {
            if (error)
              return connection.rollback(() => {
                throw error
              })
            if (results.affectedRows !== 0) status = true
          }
        )

        connection.commit((error) => {
          if (error)
            return connection.rollback(() => {
              throw error
            })
          connection.release()
          if (!status) {
            return res
              .status(400)
              .json({ data: 'User with that email or username already exists' })
          } else {
            return res
              .status(201)
              .json({ data: 'Your account has been created' })
          }
        })
      })
    })
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
      async (error, results) => {
        if (error) throw error

        if (results[0] === undefined)
          return res.status(404).json({ data: 'Could not find user' })

        const user = results[0]
        const hash = user.password
        if (hash) {
          const isValid = await verifyPassword(password, hash)
          if (isValid) {
            delete user.password

            pool.query(
              `UPDATE users SET last_login = NOW() ` + `WHERE users_id = ?;`,
              [user.id],
              async (error, results) => {
                if (error) throw error

                const token = await signToken(user.id)
                return res.status(200).json({ token, user })
              }
            )
          } else {
            return res.status(401).json({ data: 'Wrong password' })
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

exports.updateUser = async (req, res) => {
  const { id } = req.user
  const { username, email, bio, password } = req.body
  const pool = await getPool()
  let hash = undefined
  if (password) {
    hash = await hashPassword(password)
  }
  try {
    pool.query(
      `
      UPDATE users
      SET
        username = COALESCE(?, username),
        email = COALESCE(?, email),
        bio = COALESCE(?, bio),
        password = COALESCE(?, password)
      WHERE users_id = ?;
    `,
      [username, email, bio, hash, id],
      (error) => {
        if (error) throw error
        return res.status(200).json({ data: 'User info updated' })
      }
    )
  } catch (error) {
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
}

exports.addGameToUser = async (req, res) => {
  const { id } = req.user
  const game = req.body.game
  const pool = await getPool()

  try {
    pool.query(
      'INSERT INTO users_games (user_id, game_id, platform_id, `rank`, comment) ' +
        'VALUES(?, ?, ?, ?, ?)',
      [id, game.gameId, 1, null, null],
      (error) => {
        if (error) throw error
        return res.status(201).json({ data: 'Game added' })
      }
    )
  } catch (error) {
    return res
      .status(500)
      .json({ data: `Something went wrong, please try again. ${error}` })
  }
}

exports.addPlatformToUser = async (req, res) => {
  const { id } = req.user
  const platform = req.body.platform
  const pool = await getPool()

  try {
    pool.query(
      'INSERT INTO users_platforms (user_id, platform_id, gamertag) ' +
        'VALUES(?, ?, ?)',
      [id, platform.platformId, 'Jane doe'],
      (error, results) => {
        if (error) throw error
        return res.status(201).json({ data: 'Platform added' })
      }
    )
  } catch (error) {
    return res
      .status(500)
      .json({ data: `Something went wrong, please try again. ${error}` })
  }
}
