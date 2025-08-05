import { logoutUser } from '~/server/usecase/auth/logout'

export default defineEventHandler(async (event) => {
  return logoutUser(event)
})