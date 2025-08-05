import { getCurrentUser } from '~/server/usecase/auth/get-user'

export default defineEventHandler(async (event) => {
  return getCurrentUser(event)
})