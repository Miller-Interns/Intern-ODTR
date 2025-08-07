import { BatchService } from '~/services/patch-auto-status.service';

export async function updateStatusUseCase() {
  const updatedBatches = await BatchService.updateIncomingStatus();
  return updateStatusUseCase;
}