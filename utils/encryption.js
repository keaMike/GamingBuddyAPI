const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const saltRounds = 10

exports.hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.log(error)
  }
}

exports.verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.log(error)
  }
}

exports.signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
