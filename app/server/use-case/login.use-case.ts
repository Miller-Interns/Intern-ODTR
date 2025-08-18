import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { loginSchema } from './useAuth.schema'
import type { H3Event } from 'h3'
import z from 'zod'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'
import type { User } from '../db/types'
import type { Selectable } from 'kysely'

const dtoSchema = z.object({
	email: z.string(),
	password: z.string().min(6).max(100),
})
const validateDTO = createSchemaValidator(dtoSchema)
type LoginDTO = z.infer<typeof dtoSchema>

type LoginResult = {
	token: string
	user: Selectable<User>
}

export async function loginUseCase(dto: LoginDTO, context: RequestContext, event: H3Event): Promise<LoginResult> {
	const { email, password } = await validateDTO(dto)
	const config = useRuntimeConfig()

	const jwtSecret = config.JWT_SECRET

	if (!jwtSecret) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Server misconfiguration',
		})
	}

	const user = await userService.getUserByEmail(email, context)
	if (!user || !user.password) {
		throw createError({
			statusCode: 401,
			statusMessage: 'User does not exist',
		})
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		throw createError({
			statusCode: 401,
			statusMessage: 'Incorrect email or password',
		})
	}

	const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
		expiresIn: '12h',
	})

	return {
		token,
		user,
	}
}
