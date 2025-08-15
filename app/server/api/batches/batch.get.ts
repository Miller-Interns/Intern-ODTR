// import { getAllBatchesUseCase } from '~/server/use-case/use-get-batch';

// export default defineEventHandler(async (event) => {
//   try {
//     const batches = await getAllBatchesUseCase();
//     return batches; 
//   } catch (e: any) {
//     console.error('API Handler Error:', e); 
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Failed to fetch batches from the database.',
//       data: {
//         message: 'An internal server error occurred while retrieving batches.',
//       },
//     });
//   }
// });

// import { batchDetailsFactory } from '~/server/factory/batches/get-batches.factory'
// import { getAllBatchesUseCasedto } from '~/server/use-case/batches/get-batch.use-case'
// import { RequestContext } from '~/server/types/RequestContext'
// export default defineEventHandler(async (event) => {
//   console.log('read')
//   const params = getRouterParams(event)
//   const dto: any = {
//     ...params,
//   }

//   const {batches: batch } = await getAllBatchesUseCasedto(dto, event.context as RequestContext)
//   return batchDetailsFactory.toViewArray(batch)
// })

import { batchDetailsFactory } from '~/server/factory/batches/get-batches.factory'
import { getAllBatchesUseCase } from '~/server/use-case/batches/get-batch.use-case'
import { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
  try {
    // We don't need a DTO to get ALL batches
    const { batches: batch } = await getAllBatchesUseCase(event.context as RequestContext)


    return batchDetailsFactory.toViewArray(batch)
  } catch (error) {
    // This will catch errors from the use-case or factory and log them properly
    console.error('[API Error] /api/batches/batch:', error);
    // You can re-throw a structured error
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch batches.' });
  }
})