import type { RequestContext } from '~/server/types/RequestContext'
import { postBatchUseCase } from '~/server/use-case/batches/post-batch.use-case'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const dto: any = {
    ...body,
  }
  const response = await postBatchUseCase(dto, event.context as RequestContext)

  if (!response.allBatches) {
    return null
  }


  return {
    status: 'success',
  }
})

