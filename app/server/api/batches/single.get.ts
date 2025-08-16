
// import { GetBatchQuerySchema, getBatchUseCase} from '~/server/use-case/batches/get-single.use-case';
// export default defineEventHandler(async (event) => {
//   const query = getQuery(event);
//   const validation = GetBatchQuerySchema.safeParse(query);

//   if (!validation.success) {
//     throw createError({
//       statusCode: 400,
//       statusMessage: "Invalid query parameters.",
//     });
//   }

//   const { id: batchId } = validation.data;

//   try {

//     const batch = await getBatchUseCase(batchId);
//     return batch;
//   } catch (error: any) {

//     if (error.message === 'Batch not found.') {
//       throw createError({
//         statusCode: 404,
//         statusMessage: 'Batch not found.',
//       });
//     }

//     throw createError({
//       statusCode: 500,
//       statusMessage: 'An unexpected error occurred.',
//     });
//   }
// });

import { userFactory } from '~/server/factory/batches/get-single.factory'
import { getBatchUseCase} from '~/server/use-case/batches/get-single.use-case';
import { RequestContext } from '~/server/types/RequestContext'

export default defineEventHandler(async (event) => {
 
  const query = getQuery(event);
  const dto: any = {
    id: query.id as string,
  };

  if (!dto.id) {
    throw createError({
      statusCode: 400, 
      statusMessage: 'Batch ID is required.',
    });
  }
  
  try {
   const { batch } = await getBatchUseCase(dto, event.context as RequestContext)
  
    return userFactory.toFullResponse(batch);
   

  } catch (error: any) {
    if (error.message.includes('Batch not found')) {
      throw createError({
        statusCode: 404, 
        statusMessage: 'Batch not found.',
      });
    }

    console.error(`[API] Failed to fetch batch ${dto.id}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'An internal error occurred.',
    });
  }
});