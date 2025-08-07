import { getCurrentUser } from '~/server/use-cases/useGetUser'

export default defineEventHandler(async (event) => {
  return getCurrentUser(event)
})