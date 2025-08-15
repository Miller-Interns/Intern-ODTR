
import { GetBatchQuerySchema, getBatchUseCase} from '~/server/use-case/batches/get-single.use-case';
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const validation = GetBatchQuerySchema.safeParse(query);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid query parameters.",
    });
  }

  const { id: batchId } = validation.data;

  try {

    const batch = await getBatchUseCase(batchId);
    return batch;
  } catch (error: any) {

    if (error.message === 'Batch not found.') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found.',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred.',
    });
  }
});