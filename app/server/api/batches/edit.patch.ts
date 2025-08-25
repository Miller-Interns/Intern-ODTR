import { patchBatchUseCase} from '~/server/use-case/batches/patch-edit.use-case';
import type { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
 
  const body = await readBody(event)
  const dto: any = {
    ...body,
  }
   const  response  = await patchBatchUseCase(dto, event.context as RequestContext)
   

  if (!response.batch) {
    return null
  }


  return {
    status: 'success',
  }
})


