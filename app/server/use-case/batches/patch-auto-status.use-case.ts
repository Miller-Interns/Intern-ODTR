import { Status } from '~/enum/enums';
import { z } from 'zod';
import { BatchService } from '~/server/service/batches/patch-auto-status.service';
import { type Batch } from '~/types/Types';
import type { RequestContext } from '~/server/types/RequestContext'
import {type Selectable } from 'kysely';


export const dtoSchema = z.object({
  status:z.enum([Status.INCOMING, Status.ONGOING])
});


export type GetCurrentUserDTO = z.infer<typeof dtoSchema>

type GetCurrentBatchResult = {
  batch: Selectable<Batch>
}

export async function patchStatusUseCase(dto: GetCurrentUserDTO, 
  context: RequestContext ): Promise <GetCurrentBatchResult>{
      
    
    await checkAuthentication(context)
      const batch = await BatchService.updateIncomingStatus(context);
      if (!batch) {
        throw new Error('Batch not found.');
      }
      return {batch};
    }
    