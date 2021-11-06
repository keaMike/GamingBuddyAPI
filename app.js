require('dotenv').config()
require('./database/mysqlConfig').initConnection()
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const swipeRoutes = require('./routes/swipeRoutes')
const messageRoutes = require('./routes/messageRoutes')
const configRoutes = require('./routes/configRoutes')

const PORT = process.env.PORT | 3000

app.use(express.json())

app.use('/users', userRoutes)

app.use('/swipes', swipeRoutes)

app.use('/messages', messageRoutes)

app.use('/config', configRoutes)

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})