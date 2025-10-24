const express = require('express')
const cors = require('cors')
require('dotenv').config()

const userRouter = require('../routes/userRouter.js')

const app = express()

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/users', userRouter)

// Run server
app.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
