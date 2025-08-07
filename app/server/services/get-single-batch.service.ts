import { db } from '~/server/db';

async function findById(batchId: string) {
  const batch = await db
    .selectFrom('batches')
    .leftJoin('users', 'users.id', 'batches.supervisorId')
    .where('batches.id', '=', batchId)
    .selectAll('batches')
    .select('users.name as supervisor_name')
    .executeTakeFirst();

  return batch;
}

export const BatchService = {
  findById,
};