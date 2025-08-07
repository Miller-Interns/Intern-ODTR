import { logoutUser } from '~/server/use-cases/useLogout'

export default defineEventHandler(async (event) => {
  return logoutUser(event)
})