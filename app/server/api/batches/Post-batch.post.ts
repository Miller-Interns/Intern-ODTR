
// import {postBatchUseCase } from '~/server/use-case/batches/post-batch.use-case'
// import { BatchCreateInputSchema } from '~/server/service/batches/post-batch.service';


// export default defineEventHandler(async (event) => {

//   const body = await readBody(event);
//   const validation = BatchCreateInputSchema.safeParse(body);

//   if (!validation.success) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: validation.error.issues.map(issue => issue.message).join('. '),
//     });
//   }
//   try {
//     const result = await postBatchUseCase(validation.data);
//     return result;

//   } catch (e: any) {
//     if (e.message === 'BATCH_CONFLICT') {
//       throw createError({
//         statusCode: 409, 
//         statusMessage: 'Batch name already exist',
//       });
//     }


//     throw createError({
//       statusCode: 500, 
//       statusMessage: 'An unexpected error occurred while creating the batch.',
//     });
//   }
// });
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

