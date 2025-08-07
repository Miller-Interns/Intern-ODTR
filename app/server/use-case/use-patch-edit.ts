
import { type BatchUpdateData, BatchService} from '~/server/services/patch-edit-batch.service';
export async function editBatchDetailsUseCase(id: string, data: Omit<BatchUpdateData, 'id'>) {
  await BatchService.editBatchDetails(id, data);
}