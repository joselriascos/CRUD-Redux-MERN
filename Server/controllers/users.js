const {
  validateUser,
  validateParcialUser,
} = require('../validations/zodSchemas.js')
const UserModel = require('../models/mongoDB/users.js')

class usersController {
  static async getAll(req, res) {
    const users = await UserModel.getAll()
    return res.json(users)
  }

  static async addUser(req, res) {
    const { body } = req
    const result = validateUser(body)
    if (!result.success)
      return res.status(400).json({ error: 'Invalid user data' })

    const user = await UserModel.addUser(result.data)
    if (!user) return res.status(400).json({ error: 'User already exists' })

    return res.json(user)
  }

  static async editUser(req, res) {
    const result = validateUser(req.body)
    if (!result.success)
      return res.status(400).json({ error: 'Invalid user data' })

    const user = await UserModel.updateUser(result.data)
    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.json(user)
  }

  static async deleteUser(req, res) {
    const result = validateParcialUser(req.params)
    if (!result.success) return res.status(400).json({ error: 'Invalid id' })

    const { id } = result.data
    const userDeleted = await UserModel.deleteUser(id)
    if (!userDeleted) return res.json({ error: 'User not found' })

    return res.json({ message: 'User deleted' })
  }
}

module.exports = usersController
