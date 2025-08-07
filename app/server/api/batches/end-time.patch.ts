
import {markBatchAsCompletedUseCase, MarkAsCompletedSchema} from '~/use-case/use-end-time';


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation =  MarkAsCompletedSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400, 
      statusMessage: 'Invalid request body',
      data: validation.error.issues,
    });
  }

  const { id, end_date } = validation.data;

  try {
    await markBatchAsCompletedUseCase (validation.data);;
    return { success: true, message: 'Batch updated successfully.' };
  } catch (e: any) {
    if (e.message === 'Batch not found') {
      throw createError({
        statusCode: 404,
        statusMessage: `Batch with ID '${id}' was not found.`,
      });
    }
    throw createError({
      statusMessage: 'An unexpected error occurred while updating the batch.',
    });
  }
});
