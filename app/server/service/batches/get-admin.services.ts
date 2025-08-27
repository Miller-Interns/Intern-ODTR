

import { db } from '~/server/db/index';
import type { RequestContext } from '~/server/types/RequestContext'
import type { AdminUserFull } from '~/server/response/batches/get-admin.response';

async function findAdmins(isAdmin: boolean, ctx: RequestContext): 
  Promise<AdminUserFull[]> { 
  
  const qb = (ctx.trx ??= db);
  const adminUsers = await qb
    .selectFrom('users')
    .where('isAdmin', '=', isAdmin)
    .select(['id','name'])
    .execute();

  return adminUsers;
}

export const AdminUserService = {
  findAdmins,
};