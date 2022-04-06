require('dotenv').config()
require('./database/mysqlConfig').initConnection()
const express = require('express')
const app = express()
const session = require('express-session')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const loginRoutes = require('./routes/loginRoutes')
const userRoutes = require('./routes/userRoutes')
const swipeRoutes = require('./routes/swipeRoutes')
const messageRoutes = require('./routes/messageRoutes')

const PORT = process.env.PORT | 3000

app.use(express.json())

app.use('/api/login', loginRoutes)

app.use('/api/users', userRoutes)

app.use('/api/swipes', swipeRoutes)

app.use('/api/messages', messageRoutes)

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})