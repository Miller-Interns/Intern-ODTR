import { batchService } from '~/server/service/batches/batch.service'
import type { RequestContext } from '~/server/types/RequestContext'

export const getAllBatchesUseCase = async (_context: RequestContext) => {
  const rawBatches = await batchService.getAllBatchesWithDetails()

  return rawBatches.map(batch => ({
    id: batch.id,
    batchNumber: batch.batch_number,
    status: batch.status,
    supervisor: batch.supervisorName ?? 'N/A',
    internCount: Number(batch.internCount),
  }))
}