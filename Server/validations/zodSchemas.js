const z = require('zod')

const userSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  github: z.string(),
})

const validateUser = (user) => {
  return userSchema.safeParse(user)
}

const validateParcialUser = (user) => {
  return userSchema.partial().safeParse(user)
}

module.exports = {
  validateUser,
  validateParcialUser,
}
