const { v4: uuidv4 } = require('uuid');
const { getPool } = require('../database/mysqlConfig')
const { findUsersSwipedOn } = require('./swipeController')
const {
  hashPassword,
  verifyPassword,
  signToken,
} = require('../utils/encryption')

exports.getUsers = async (req, res) => {
  const ownId = req.user.id
  const skip = req.query.skip ? req.query.skip : 0
  const limit = req.query.limit ? req.query.limit : 500
  const pool = await getPool()

  try {
    await findUsersSwipedOn(ownId, (ids) => {
      let idString = ""

      if (ids) {
        ids.map(id => {
          idString = idString + `'${id}',`
        })
        idString = idString.slice(0, idString.length - 1)
      }
      
      pool.query(
        `
        SELECT * FROM user_profiles
        WHERE id != ?
        AND id NOT IN (${idString})
        ORDER BY id ASC
        LIMIT ?
        OFFSET ?
      `,
        [ownId, Number(limit), Number(skip)],
        (error, results) => {
          const returnObject = []

          if (results[0] === undefined) return res.status(404).json({ data: 'Could not find users' })

          results.forEach(result => {
            returnObject.push({
              id: result.id,
              bio: result.bio,
              username: result.username,
              games: JSON.parse(result.games),
              platforms: JSON.parse(result.platforms)
            })
          })
          
          if (error) throw error
          return res.status(200).json({ data: returnObject })
        }
      )
    });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: `Something went wrong, please try again. ${error}` })
  }
}

exports.getUsersFromIds = async (idArray, callback) => {
  const pool = await getPool()
  let idString = ""

  idArray.map(id => {
    idString = idString + `'${id}',`
  })
  idString = idString.slice(0, idString.length - 1)

  try {
    pool.query(
      `SELECT * FROM user_profiles ` + 
      `WHERE id IN (${idString})`,
      (error, results) => {
        if (error) throw error

        const returnArray = []

        results.map(result => {
          returnArray.push({
            id: result.id,
            username: result.username,
            bio: result.bio,
            games: JSON.parse(result.games),
            platforms: JSON.parse(result.platforms)
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

        if (results[0] === undefined) return res.status(404).json({ data: 'Could not find user' })

        const resultObject = results[0]
        const returnObject = {
          bio: resultObject.bio,
          username: resultObject.username,
          games: JSON.parse(resultObject.games),
          platforms: JSON.parse(resultObject.platforms)
        }

        return res.status(200).json({ data: returnObject })
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

exports.signUpProcess = async (username, email, password, bio, callback) => {
  const pool = await getPool()

  if (!username || !email || !password) {
    callback(null, 'Please fill all fields', 400)
    return
  }

  try {
    pool.getConnection(async (error, connection) => {
      connection.beginTransaction(async error => {
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
            if (error) return connection.rollback(() => { throw error })
            if (results.affectedRows !== 0) status = true
          }
        )

        connection.commit((error) => {
          if (error) return connection.rollback(() => { throw error })
          connection.release()
          if (!status) {
            callback(null, 'User with that email or username already exists', 400)
            return
          } else {
            callback('Your account has been created', null, 201)
            return
          }
        })
      })
    })
  } catch (error) {
    callback(null, 'Something went wrong, please try again', 500)
    return
  }
}

exports.signUp = async (req, res) => {
  const { username, email, password, bio } = req.body
  
  await this.signUpProcess(username, email, password, bio, (success, error, statusCode) => {
    if (success) return res.status(statusCode).send({ data: success })
    else return res.status(statusCode).send({ data: error })
  })
}

exports.signInProcess = async (email, password, callback) => {
  const pool = await getPool()

  if (!email || !password) {
    callback(null, 'Please fill both fields', 404)
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

        if (results[0] === undefined) {
          callback(null, 'Could not find user', 404)
          return
        }

        const user = results[0]
        const hash = user.password
        if (hash) {
          const isValid = await verifyPassword(password, hash)
          if (isValid) {
            delete user.password
            
            pool.query(
              `UPDATE users SET last_login = NOW() ` +
              `WHERE users_id = ?;`,
              [user.id],
              async (error, results) => {
                if (error) throw error

                const token = await signToken(user.id)
                callback({ token, user }, null, 200)
                return 
              }
              )
          } else {
            callback(null, 'Wrong password', 401)
            return
          }
        } else {
          callback(null, 'Email has not been registered', 400)
          return
        }
      }
    )
  } catch (error) {
    callback(null, 'Something went wrong, please try again', 500)
  }
}

exports.signIn = async (req, res) => {
  const { email, password } = req.body
  
  await this.signInProcess(email, password, (success, error, statusCode) => {
    if (success) return res.status(statusCode).send({ data: success })
    else return res.status(statusCode).send({ data: error })
  })
}

exports.addGameToUser = async (req, res) => {
  const { id } = req.user
  const game = req.body.game
  const pool = await getPool()

  try {
    pool.query(
      'INSERT INTO users_games (user_id, game_id, platform_id, `rank`, comment) ' +
      'VALUES(?, ?, ?, ?, ?)',
      [id, game.gameId, game.platformId, game.rank, game.comment],
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
      [id, platform.platformId, platform.gamertag],
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