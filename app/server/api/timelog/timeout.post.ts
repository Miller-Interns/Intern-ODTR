// app/server/api/timelog/timeout.post.ts

// FIX: Use a relative path for the import
import { timeOutUseCase } from '../../use-case/timeout.use-case'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // The context is passed implicitly and should now be correctly handled by the use case
  return await timeOutUseCase(body, event.context)
})