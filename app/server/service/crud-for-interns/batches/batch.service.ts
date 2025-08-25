import { db } from '~/server/db'
import { sql } from 'kysely'
import type { Batch, Intern } from '~/server/db/types'
import type { BatchListItem as ServiceBatchListItem } from '~/types/crud-for-interns/Batch'

export type KyselyBatchListItem = Omit<ServiceBatchListItem, 'batchNumber' | 'supervisor' | 'status'> & {
  batch_number: string;
  supervisorName: string | null;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
}

async function getAllBatchesWithDetails(): Promise<KyselyBatchListItem[]> {
  const result = await db
    .selectFrom('batches')
    .leftJoin('users as supervisor', 'supervisor.id', 'batches.supervisorId')
    .select([
      'batches.id',
      'batches.batch_number',
      'batches.status',
      'supervisor.name as supervisorName',
      sql<number>`(SELECT COUNT(*) FROM interns WHERE interns.batch_id = batches.id)`.as('internCount'),
    ])
    .orderBy('batches.start_date', 'desc')
    .execute()
  
  return result as unknown as KyselyBatchListItem[];
}

export type BatchAndSupervisor = Batch & { supervisorName: string | null };
export type InternWithUser = Intern & { fullName: string | null };

async function getBatchAndSupervisor(id: string): Promise<BatchAndSupervisor | undefined> {
  const result = await db
    .selectFrom('batches')
    .selectAll('batches')
    .leftJoin('users as supervisor', 'supervisor.id', 'batches.supervisorId')
    .select('supervisor.name as supervisorName')
    .where('batches.id', '=', id)
    .executeTakeFirst()
  
  return result as unknown as BatchAndSupervisor | undefined;
}

async function getInternsByBatchId(batchId: string): Promise<InternWithUser[]> {
  const result = await db
    .selectFrom('interns')
    .selectAll('interns')
    .leftJoin('users', 'users.id', 'interns.user_id')
    .select('users.name as fullName')
    .where('interns.batch_id', '=', batchId)
    .orderBy('users.name', 'asc')
    .execute()

  return result as unknown as InternWithUser[];
}

export const batchService = {
  getAllBatchesWithDetails,
  getBatchAndSupervisor,
  getInternsByBatchId,
}