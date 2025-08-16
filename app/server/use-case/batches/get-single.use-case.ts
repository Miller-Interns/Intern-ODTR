import { Status } from '~/enums/status';
import { z } from 'zod';
import { BatchService } from '~/server/service/batches/get-single-batch.service';
import { type Batch } from '~/types/Types';
import { RequestContext } from '~/server/types/RequestContext';
import { Selectable } from 'kysely';

export const dtoSchema = z.object({
  id: z.string(),
})
const validateDTO = createSchemaValidator(dtoSchema)
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

type GetCurrentBatchResult = {
  batch: Selectable<Batch>
}


export const getBatchUseCase= async (dto: GetCurrentUserDTO, context: RequestContext): Promise<GetCurrentBatchResult> => {
await checkAuthentication(context)
  const { id } = await validateDTO(dto)
  const batch = await BatchService.findById(id, context);
  if (!batch) {
    throw new Error('Batch not found.');
  }
  return {batch};
}