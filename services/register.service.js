const bcrypt = require('bcryptjs')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const createError = require("../utils/createError")

const PASSWORD_MIN_LENGTH = 8
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12

function isPasswordStrong(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

const authService = async ({ username, email, password }) => {
     if (!isPasswordStrong(password)) {
       throw createError(
         "Password must be at least 8 characters with uppercase, lowercase, and a number",
         400
       );
     }

     const isEmail = await User.exists({ email })
     if (isEmail) {
          throw createError("Email already exists", 409);
     }

     const hashpass = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

     const user = await User.create({
          username,
          email,
          password: hashpass
     })

     const token = jwt.sign({
          userId: user._id
     }, process.env.JWT_SECRET,
          { expiresIn: '1d' }
     )
     return { token }
}

module.exports = authService
