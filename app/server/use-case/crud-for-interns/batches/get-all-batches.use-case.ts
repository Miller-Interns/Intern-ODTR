import { batchService } from '~/server/service/crud-for-interns/batches/batch.service'
import type { RequestContext } from '~/server/types/RequestContext'
import { batchFactory } from '~/server/factory/crud-for-interns/batches/batch.factory'

export const getAllBatchesUseCase = async (_context: RequestContext) => {

  const rawBatches = await batchService.getAllBatchesWithDetails()

  return batchFactory.toBatchListResponse(rawBatches);
}