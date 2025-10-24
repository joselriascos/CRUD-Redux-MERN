const users = require('../users.json')
const {
  validateUser,
  validateParcialUser,
} = require('../validations/zodSchemas.js')

class usersController {
  static async getAll(req, res) {
    return res.json(users)
  }

  static async addUser(req, res) {
    const { body } = req
    const result = validateUser(body)
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid user data' })
    }

    if (users.some((user) => user.id === result.data.id)) {
      return res.status(400).json({ error: 'User already exists' })
    }

    users.push(result.data)
    return res.json(result.data)
  }

  static async editUser(req, res) {
    const result = validateUser(req.body)
    if (!result.success)
      return res.status(400).json({ error: 'Invalid user data' })

    const userIndex = users.findIndex((user) => user.id === result.data.id)
    if (userIndex === -1)
      return res.status(404).json({ error: 'User not found' })

    const user = users[userIndex]
    user.name = result.data.name
    user.email = result.data.email
    user.github = result.data.github

    return res.json(result.data)
  }

  static async deleteUser(req, res) {
    const result = validateParcialUser(req.params)
    if (!result.success) return res.status(400).json({ error: 'Invalid id' })

    const userIndex = users.findIndex((user) => user.id === result.data.id)
    if (userIndex === -1)
      return res.status(404).json({ error: 'User not found' })

    users.splice(userIndex, 1)

    return res.json('User deleted successfully')
  }
}

module.exports = usersController
