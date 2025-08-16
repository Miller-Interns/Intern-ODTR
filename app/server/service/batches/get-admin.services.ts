// import { Selectable } from 'kysely';
// import { db } from '~/server/db/index';
// import { RequestContext } from '~/server/types/RequestContext';
// import type { User } from '~/types/Types'


// async function findAdmins(isAdmin: boolean, ctx: RequestContext): 
// Promise <User[]>{
//   const qb = (ctx.trx ??= db)
//   const adminUsers = await qb
//     .selectFrom('users')
//     .where('isAdmin', '=', isAdmin)
//     .select(['id','name'])
//     .execute();

//   return adminUsers;
// }

// export const AdminUserService = {
//   findAdmins,
// };

// in get-admin.services.ts

import { db } from '~/server/db/index';
import { RequestContext } from '~/server/types/RequestContext';
// IMPORT the specific, lean type you are actually returning
import type { AdminUserFull } from '~/server/response/batches/get-admin.response';

// FIX: The function must promise the type it actually returns.
async function findAdmins(isAdmin: boolean, ctx: RequestContext): 
  Promise<AdminUserFull[]> { // <-- FIX
  
  const qb = (ctx.trx ??= db);
  const adminUsers = await qb
    .selectFrom('users')
    .where('isAdmin', '=', isAdmin)
    .select(['id','name']) // This query returns objects matching AdminUserFull
    .execute();

  return adminUsers;
}

export const AdminUserService = {
  findAdmins,
};