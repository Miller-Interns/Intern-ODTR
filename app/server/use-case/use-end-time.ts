

import { BatchService } from '~/server/services/patch-end-time.service';
import {z} from 'zod'
export const MarkAsCompletedSchema = z.object({
  id: z.string().min(1, 'Batch ID is required.'),
  end_date: z.string() 
});

type MarkBatchAsCompletedData = z.infer<typeof MarkAsCompletedSchema>;
export async function markBatchAsCompletedUseCase(data: MarkBatchAsCompletedData) {

  const result = await BatchService.updateCompletionStatus({
    id: data.id,
    end_date: data.end_date,
  });

  if (result.numUpdatedRows === 0n) {
    throw new Error(`Batch with ID '${data.id}' not found or no update was needed.`);
  }


}




