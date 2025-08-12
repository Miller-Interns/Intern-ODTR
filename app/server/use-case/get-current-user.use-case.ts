import z from 'zod'
import { createSchemaValidator } from '../utils/create-schema-validator'

import { checkAuthentication } from '../utils/check-authentication'
import { userService } from '../service/user.service'
import type { Selectable } from 'kysely'
import type { User } from '../db/types'
import { RequestContext } from '../types/RequestContext'

const dtoSchema = z.object({
	id: z.string(),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

type GetCurrentUserResult = {
	user: Selectable<User>
}

export const getCurrentUser = async (dto: GetCurrentUserDTO, context: RequestContext): Promise<GetCurrentUserResult> => {
	await checkAuthentication(context)
	const { id } = await validateDTO(dto)

	const user = await userService.getUserById(id, context)

	if (!user) {
		throw createError({
			status: 404,
			message: 'User not found',
		})
	}

	return { user }
}
