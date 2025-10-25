const express = require('express')
const cors = require('cors')
require('dotenv').config()
const serverless = require('serverless-http')

const connectDB = require('../config/db.js')
const userRouter = require('../routes/userRouter.js')

const app = express()

const PORT = process.env.PORT || 3000

// Connet to database
app.use(async (req, res, next) => {
  await connectDB(process.env.DB_NAME)
  next()
})

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/users', userRouter)

// Run serverless
module.exports.handler = serverless(app)

// Run server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
