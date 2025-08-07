

import { UserService } from '~/services/get-admin.services';


export async function getAdminUsersUseCase() {
  const adminUsers = await UserService.findAdmins();
  return adminUsers;
}