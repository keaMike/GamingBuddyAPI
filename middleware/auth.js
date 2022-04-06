exports.protected = (req, res, next) => {
  if (req.headers['x-api-key'] == process.env['ADMIN_API_KEY']) {
    req.user = {
      id: req.headers['user-id']
    }
    next()
  } else {
    if (req.session.user) {
      req.user = req.session.user
      next()
    } else {
      return res.status(401).json({ data: 'You are not authorized' })
    }
  }
}
