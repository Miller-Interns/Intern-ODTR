import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const jwtSecret = process.env.JWT_SECRET

  if (token && jwtSecret) {
    try {
      const decoded = jwt.verify(token, jwtSecret)
      event.context.user = decoded
    } catch {
      event.context.user = null
    }
  } else {
    event.context.user = null
  }
})
