
import { z } from 'zod';
import { BatchService } from '~/server/service/batches/patch-end-time.service';
import { type Batch } from '~/types/Types';
import type { RequestContext } from '~/server/types/RequestContext'
import {type Selectable } from 'kysely';
export const dtoSchema = z.object({
  id: z.string(),
  end_date: z.coerce.date() 
});

const validateDTO = createSchemaValidator(dtoSchema)
export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

type GetCurrentBatchResult = {
  batch: Selectable<Batch>
}


export async function patchEndTimeUseCase(dto: GetCurrentUserDTO, 
  context: RequestContext ): Promise <GetCurrentBatchResult>{

  const {id, end_date}= await validateDTO(dto)

await checkAuthentication(context)
  const batch = await BatchService.updateCompletionStatus(id, end_date, context);
  if (!batch) {
    throw new Error('Batch not found.');
  }
  return {batch};
}





