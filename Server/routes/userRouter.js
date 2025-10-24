const { Router } = require('express')
const usersController = require('../controllers/users.js')

const userRouter = Router()

userRouter.get('/', usersController.getAll)
userRouter.post('/', usersController.addUser)
userRouter.put('/', usersController.editUser)
userRouter.delete('/:id', usersController.deleteUser)

module.exports = userRouter
