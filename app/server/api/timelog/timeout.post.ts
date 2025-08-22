import { timeOutUseCase } from '../../use-case/timeout.use-case'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return await timeOutUseCase(body, event.context)
})