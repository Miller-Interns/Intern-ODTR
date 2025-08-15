import { BatchService } from '~/server/service/batches/patch-auto-status.service';

export async function updateStatusUseCase() {
  const updatedBatches = await BatchService.updateIncomingStatus();
  return updateStatusUseCase;
}