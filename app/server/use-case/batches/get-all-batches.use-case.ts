import { batchService } from '~/server/service/batches/batch.service'
import type { RequestContext } from '~/server/types/RequestContext'
import { batchFactory } from '~/server/factory/batches/batch.factory'

export const getAllBatchesUseCase = async (_context: RequestContext) => {

  const rawBatches = await batchService.getAllBatchesWithDetails()

  return batchFactory.toBatchListResponse(rawBatches);
}