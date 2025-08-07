
import {postBatchUseCase } from '~/use-case/use-post-batch'
import { BatchCreateInputSchema } from '~/services/post-batch.service';


export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  const validation = BatchCreateInputSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.issues.map(issue => issue.message).join('. '),
    });
  }
  try {
    const result = await postBatchUseCase(validation.data);
    return result;

  } catch (e: any) {
    if (e.message === 'BATCH_CONFLICT') {
      throw createError({
        statusCode: 409, 
        statusMessage: 'Batch name already exist',
      });
    }


    throw createError({
      statusCode: 500, 
      statusMessage: 'An unexpected error occurred while creating the batch.',
    });
  }
});