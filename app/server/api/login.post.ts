import { loginUseCase } from '~/server/usecase/auth/login'

export default defineEventHandler(async (event) => {
    return await loginUseCase(event)
})