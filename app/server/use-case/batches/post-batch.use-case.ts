
import {z} from 'zod'
import {Status} from '~/enum/enums'
import type { RequestContext } from '~/server/types/RequestContext'
import { type Batch } from '~/types/Types'
import { BatchService } from '~/server/service/batches/post-batch.service'
import { type Selectable } from 'kysely'

const dtoSchema=z.object({
  batch_number: z.string(),
  start_date: z.coerce.date(),
  status: z.enum([Status.INCOMING,Status.ONGOING]),
  supervisorId: z.string()
})
const validateDTO = createSchemaValidator(dtoSchema)
type CreateDTO = z.infer<typeof dtoSchema>


type BatchResult={
  allBatches: Selectable <Batch >
}
export async function postBatchUseCase(dto: CreateDTO, 
  context: RequestContext ): Promise <BatchResult>{

  const {batch_number, start_date, status, supervisorId}= await validateDTO(dto)

try{
  const allBatches = await BatchService.createBatch( batch_number, start_date, status,
     supervisorId, context)
  if (!allBatches) {

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create the batch.',
    })
  }

return { allBatches}
} catch (error: any) {
    if (error.message === 'BATCH_CONFLICT') {
      throw createError({
        statusCode: 409, 
        statusMessage: 'This batch number is already taken.',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'An unexpected error occurred.',
    });
  }
}