require('dotenv').config()
require('./database/dbConfig').initConnection()
const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes')

const PORT = process.env.PORT | 3000

app.use(express.json())

app.use('/users', userRoutes)

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`)
})
