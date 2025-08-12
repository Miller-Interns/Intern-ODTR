import { z } from 'zod'
import { UserSchema } from '../db/schema'

export const ResponseUserFullSchema = z.object({
	id: UserSchema.shape.id,
	email: UserSchema.shape.email,
	name: UserSchema.shape.name,
	password: UserSchema.shape.password,
	isAdmin: UserSchema.shape.isAdmin,
	createdAt: UserSchema.shape.createdAt,
	updatedAt: UserSchema.shape.updatedAt,
})

export type ResponseUserFull = z.infer<typeof ResponseUserFullSchema>
