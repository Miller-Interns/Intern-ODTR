

import { BatchService } from "~/server/service/batches/get-all-batch.service";
import { type BatchWithInternCount } from '~/types/Types'
import type { RequestContext } from '~/server/types/RequestContext'

type GetAllBatchResult = {
  batches: BatchWithInternCount[]
}

export const getAllBatchesUseCase = async (
  context: RequestContext
): Promise<GetAllBatchResult> => {

  const batches = await BatchService.getAllBatchesWithDetails();
  
  if (!batches) {
		throw createError({
			status: 404,
			message: 'No batches found',
		})
	}
  return { batches }
}