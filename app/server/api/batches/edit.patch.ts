import {editBatchDetailsUseCase} from '~/server/use-case/batches/patch-edit.use-case';
import { BatchUpdateSchema } from '~/server/service/batches/patch-edit-batch.service';
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = BatchUpdateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400, 
      statusMessage: 'Invalid request body',
      data: validation.error.issues,
    });
  }
  const { id, ...updateData } = validation.data;

  try {
    await editBatchDetailsUseCase(id, updateData);
    return { success: true, message: 'Batch updated successfully.' };
  } catch (e: any) {
    if (e.message.includes('not found')) {
      throw createError({
        statusCode: 404, 
        statusMessage: `Batch with ID '${id}' not found.`,
      });
    }
    console.error('API Error in update.patch.ts:', e);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update batch.',
    });
  }
});