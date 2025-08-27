import { z } from 'zod'
import { UserSchema } from '~/server/db/schema'

export const AdminFullSchema = z.object({
	  id: UserSchema.shape.id,
 	name: UserSchema.shape.name,

})
export const AdminViewArraySchema = z.array(AdminFullSchema);
export type AdminUserFull = z.infer<typeof AdminFullSchema>
