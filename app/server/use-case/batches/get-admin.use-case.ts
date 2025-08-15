
import { UserService } from '~/server/service/batches/get-admin.services';


export async function getAdminUsersUseCase() {
  const adminUsers = await UserService.findAdmins();
  return adminUsers;
}