
import { BatchService } from "~/services/get-all-batch.service";
export async function getAllBatchesUseCase() {
  const batches = await BatchService.getAllBatchesWithDetails();
  return batches;
}

