
import { BatchService, type BatchCreateInput } from "~/services/post-batch.service"
export async function postBatchUseCase(data: BatchCreateInput){
  const newBatch= await BatchService.createBatch(data)

const responseBatch = {
    id: newBatch.id,
    batch_number: newBatch.batch_number,
    start_date: newBatch.start_date,
    status: newBatch.status,
    supervisorId: newBatch.intern_supervisor,
  };

  return {
    success: true,
    batch: responseBatch,
  } as const;
}
