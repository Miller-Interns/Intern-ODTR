

import { batchDetailsFactory } from '~/server/factory/batches/get-batches.factory'
import { getAllBatchesUseCase } from '~/server/use-case/batches/get-batch.use-case'
import { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
  
  try {

    const { batches: batch } = await getAllBatchesUseCase(event.context as RequestContext)


    return batchDetailsFactory.toViewArray(batch)
  } catch (error) {

    console.error('[API Error] /api/batches/batch:', error);
 
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch batches.' });
  }
})


