require('dotenv').config()
require('./database/mysqlConfig').initConnection()
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')
const swipeRoutes = require('./routes/swipeRoutes')

const PORT = process.env.PORT | 3000

app.use(express.json())

app.use('/users', userRoutes)

app.use('/swipes', swipeRoutes)

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})


// TODO implement statistics in mongo + neo4j
// TODO what games are played by users? mongo + neo4j
// TODO user_profiles in mongo + neo4j