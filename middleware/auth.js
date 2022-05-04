const jwt = require('jsonwebtoken')
exports.protected = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ data: 'You are not authorized' })
  }
  try {
    const userId = jwt.verify(token, process.env.JWT_SECRET)
    req.user = userId
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ data: 'Something went wrong, please try again' })
  }
  next()
}
