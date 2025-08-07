

import { UserService } from '~/server/services/get-admin.services';


export async function getAdminUsersUseCase() {
  const adminUsers = await UserService.findAdmins();
  return adminUsers;
}