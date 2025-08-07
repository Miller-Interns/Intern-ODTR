
import { BatchService } from "~/server/services/get-all-batch.service";
export async function getAllBatchesUseCase() {
  const batches = await BatchService.getAllBatchesWithDetails();
  return batches;
}

