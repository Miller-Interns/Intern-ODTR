

// import { updateStatusUseCase } from '~/server/use-case/batches/patch-auto-status.use-case';

// export default defineEventHandler(async (event) => {
//   try {
   
//     const autoUpdateStatus = await updateStatusUseCase();
//     return autoUpdateStatus;
    
//   } catch (e: any) {

//     console.error('API Error:', e);
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to fetch batches from the database.',
//     });
//   }
// });

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
