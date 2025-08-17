import { getAllBatchesUseCase } from '~/server/use-case/batches/get-all-batches.use-case'
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
  const batches = await getAllBatchesUseCase(event.context as RequestContext)
  return batches
})