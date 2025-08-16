
// import { AdminUserService } from '~/server/service/batches/get-admin.services';
// import {z} from 'zod'
// import type { User } from '~/types/Types'
// import type { Selectable } from 'kysely'
// import { RequestContext } from '~/server/types/RequestContext'
// const dtoSchema = z.object({
//   isAdmin: z.boolean()
// })

// const validateDTO = createSchemaValidator(dtoSchema)
// export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

// type GetCurrentAdminResult = {
//   adminUsers: User[]
// }

// export const getAdminUsersUseCase= async (dto: GetCurrentUserDTO, 
//   context: RequestContext): Promise<GetCurrentAdminResult> => {
// await checkAuthentication(context)

// const {isAdmin}= await validateDTO(dto)
//   const adminUsers = await AdminUserService.findAdmins(isAdmin, context);
//  	if (!adminUsers) {
// 		throw createError({
// 			status: 404,
// 			message: 'User not found',
// 		})
// 	}

// 	return { adminUsers }
// }

// in get-admin.use-case.ts

import { AdminUserService } from '~/server/service/batches/get-admin.services';
import { z } from 'zod';
import { RequestContext } from '~/server/types/RequestContext';
// IMPORT the specific type it will now receive from the service
import { type AdminUserFull } from '~/server/response/batches/get-admin.response';

const dtoSchema = z.object({
  isAdmin: z.boolean()
});

const validateDTO = createSchemaValidator(dtoSchema);
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>;

// FIX: The result type must match the data from the service.
type GetCurrentAdminResult = {
  adminUsers: AdminUserFull[] // <-- FIX
}

export const getAdminUsersUseCase = async (dto: GetCurrentUserDTO, 
  context: RequestContext): Promise<GetCurrentAdminResult> => {
  
  await checkAuthentication(context);
  const { isAdmin } = await validateDTO(dto);
  const adminUsers = await AdminUserService.findAdmins(isAdmin, context);

  // FIX: An empty array `[]` is not "falsy". Check the length instead.
 	if (adminUsers.length === 0) { // <-- FIX
		throw createError({
			status: 404,
			message: 'User not found',
		})
	}

	return { adminUsers };
}