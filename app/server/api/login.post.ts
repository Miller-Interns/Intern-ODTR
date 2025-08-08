import { loginUseCase } from '~/server/use-cases/useLogin'

export default defineEventHandler(async (event) => {
    return await loginUseCase(event)
})