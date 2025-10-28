const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    github: { type: String, required: true },
  },
  {
    versionKey: false,
    collection: 'users',
  }
)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject._id
  },
})

userSchema.statics.getAll = async function () {
  const users = await this.find()
  return users
}

userSchema.statics.addUser = async function (userData) {
  const existingUser = await this.findOne({
    name: userData.name,
    email: userData.email,
    github: userData.github,
  })
  if (existingUser) return null

  try {
    const newUser = await this.create({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      github: userData.github,
    })
    return newUser
  } catch {
    console.log('Error creating new user')
    return null
  }
}

userSchema.statics.updateUser = async function (userData) {
  const { id, name, email, github } = userData
  const updatedUser = await this.findOneAndUpdate(
    { id: id },
    { name: name, email: email, github: github },
    { new: true }
  )
  if (!updatedUser) return null

  return updatedUser
}

userSchema.statics.deleteUser = async function (id) {
  const deletedUser = await this.findOneAndDelete({ id: id })
  if (!deletedUser) return false

  return true
}

const UserModel = mongoose.model('users', userSchema)

module.exports = UserModel
