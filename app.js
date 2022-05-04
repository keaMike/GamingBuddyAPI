require('dotenv').config()
require('./database/mysqlConfig').initConnection()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.static('public'))
app.use(cors())

const userRoutes = require('./routes/userRoutes')
const swipeRoutes = require('./routes/swipeRoutes')
const messageRoutes = require('./routes/messageRoutes')

const PORT = process.env.PORT | 3000

app.use(express.json())

app.use('/api/users', userRoutes)

app.use('/api/swipes', swipeRoutes)

app.use('/api/messages', messageRoutes)

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})
