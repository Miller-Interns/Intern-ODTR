// app/server/api/timelog/current.get.ts

// FIX: Use a relative path for the import
import { getCurrentTimeLogUseCase } from '../../use-case/get-current-timelog.use-case'

export default defineEventHandler(async (event) => {
  // The context is passed implicitly and should now be correctly handled by the use case
  return await getCurrentTimeLogUseCase(event.context)
})