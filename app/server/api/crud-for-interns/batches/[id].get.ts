import { getBatchDetailsUseCase } from '~/server/use-case/crud-for-interns/batches/get-batch-details.use-case'
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const batchId = params.id

  const batchDetails = await getBatchDetailsUseCase({ id: batchId }, event.context as RequestContext)

  return batchDetails
})