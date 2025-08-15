import { z } from 'zod';
import { BatchService } from '~/server/service/batches/get-single-batch.service';


export const GetBatchQuerySchema = z.object({
  id: z.string().min(1, { message: "An ID must be provided" }),
});

export async function getBatchUseCase(batchId: string) {

  const batch = await BatchService.findById(batchId);
  if (!batch) {
    throw new Error('Batch not found.');
  }
  return batch;
}