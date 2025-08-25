
import { AdminUserService } from '~/server/service/batches/get-admin.services';
import { z } from 'zod';
import { type RequestContext } from '~/server/types/RequestContext';
import { type AdminUserFull } from '~/server/response/batches/get-admin.response';

const dtoSchema = z.object({
  isAdmin: z.boolean()
});

const validateDTO = createSchemaValidator(dtoSchema);
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>;


type GetCurrentAdminResult = {
  adminUsers: AdminUserFull[] 
}

export const getAdminUsersUseCase = async (dto: GetCurrentUserDTO, 
  context: RequestContext): Promise<GetCurrentAdminResult> => {
  
  await checkAuthentication(context);
  const { isAdmin } = await validateDTO(dto);
  const adminUsers = await AdminUserService.findAdmins(isAdmin, context);
 	if (adminUsers.length === 0) { 
		throw createError({
			status: 404,
			message: 'User not found',
		})
	}

	return { adminUsers };
}