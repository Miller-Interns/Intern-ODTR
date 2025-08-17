

import { patchStatusUseCase} from '~/server/use-case/batches/patch-auto-status.use-case';
import { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
 
  const body = await readBody(event)
  const dto: any = {
    ...body,
  }
   const  response  = await patchStatusUseCase(dto, event.context as RequestContext)
   

  if (!response.batch) {
    return null
  }


  return {
    status: 'success',
  }
})
