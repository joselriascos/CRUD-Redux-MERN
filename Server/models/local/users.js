const users = require('../../users.json')

class UserModel {
  static async getAll() {
    return users
  }

  static async addUser(userData) {
    if (users.some((user) => user.id === userData.id)) return null

    users.push(userData)
    return userData
  }

  static async updateUser(userData) {
    const { id } = userData
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    const user = users[userIndex]
    user.name = userData.name
    user.email = userData.email
    user.github = userData.github

    return user
  }

  static async deleteUser(id) {
    const userIndex = users.findIndex((user) => user.id === id)
    if (userIndex === -1) return false

    users.splice(userIndex, 1)
    return true
  }
}

module.exports = UserModel
