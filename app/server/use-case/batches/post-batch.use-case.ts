
// import { BatchService, type BatchCreateInput } from "~/server/service/batches/post-batch.service"
// export async function postBatchUseCase(data: BatchCreateInput){
//   const newBatch= await BatchService.createBatch(data)

// const responseBatch = {
//     id: newBatch.id,
//     batch_number: newBatch.batch_number,
//     start_date: newBatch.start_date,
//     status: newBatch.status,
//     supervisorId: newBatch.intern_supervisor,
//   };

//   return {
//     success: true,
//     batch: responseBatch,
//   } as const;
// }
import {z} from 'zod'
import {Status} from '~/enums/status'
import { RequestContext } from '~/server/types/RequestContext'
import { Batch } from '~/types/Types'
import type { H3Event } from 'h3'
import { BatchService } from '~/server/service/batches/post-batch.service'
import { Selectable } from 'kysely'

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


  const allBatches = await BatchService.createBatch( batch_number, start_date, status,
     supervisorId, context)
  if (!allBatches) {
    // By throwing an error, we stop the function here.
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create the batch.',
    })
  }

return { allBatches}
}