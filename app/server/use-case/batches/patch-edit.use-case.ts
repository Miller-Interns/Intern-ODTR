import { Status } from '~/enums/status';
import { z } from 'zod';
import { BatchService } from '~/server/service/batches/patch-edit-batch.service';
import { type Batch } from '~/types/Types';
import { RequestContext } from '~/server/types/RequestContext';
import { Selectable } from 'kysely';

export const dtoSchema = z.object({
  id: z.string(),
  batch_number: z.string(),
  start_date:  z.coerce.date(),
  status: z.enum([Status.INCOMING, Status.ONGOING]),
  supervisorId: z.string()
})
const validateDTO = createSchemaValidator(dtoSchema)
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

type GetCurrentBatchResult = {
  batch: Selectable<Batch>
}


export async function patchBatchUseCase(dto: GetCurrentUserDTO, 
  context: RequestContext ): Promise <GetCurrentBatchResult>{

  const {id, batch_number, start_date, status, supervisorId}= await validateDTO(dto)

await checkAuthentication(context)
  const batch = await BatchService.editBatchDetails(id, batch_number, start_date, status, supervisorId, context);
  if (!batch) {
    throw new Error('Batch not found.');
  }
  return {batch};
}