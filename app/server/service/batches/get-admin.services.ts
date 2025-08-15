import { db } from '~/server/db/index';

async function findAdmins() {
  const adminUsers = await db
    .selectFrom('users')
    .select(['id', 'name'])
    .where('isAdmin', '=', true)
    .execute();

  return adminUsers;
}

export const UserService = {
  findAdmins,
};