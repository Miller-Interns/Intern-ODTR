
// import { BatchService } from "~/server/service/batches/get-all-batch.service";
// import {z} from 'zod'
// import { checkAuthentication } from '~/server/utils/check-authentication'
// import {Status} from '~/enums/status'
// import { createSchemaValidator } from '~/server/utils/create-schema-validator'
// import {type BatchWithInternCount } from '~/types/Types'
// import { Selectable } from 'kysely'
// import { RequestContext } from "~/server/types/RequestContext";


// const dtoSchema = z.object({
//   id: z.string(),
//   batch_number: z.string(). trim(),
//   start_date: z.date(),
//   end_date: z.date(),
//   status: z.enum([Status.INCOMING, Status.ONGOING, Status.COMPLETED]),
//   intern_count: z.number(),
//   supervisorId: z.string(),
//   supervisor_name: z.string(),
// });
// const validateDTO = createSchemaValidator(dtoSchema)
// export type GetAllBatchesDTO = z.infer<typeof dtoSchema>

// type GetAllBatch = {
//   batches:BatchWithInternCount[]
// }

// export const getAllBatchesUseCasedto = async (
//   dto: GetAllBatchesDTO,
//   context: RequestContext
// ): Promise<GetAllBatch> => {
//   await checkAuthentication(context);

//   const { id, batch_number, start_date, 
//     end_date, status, intern_count,
//   supervisorId, supervisor_name }= await validateDTO(dto)

//   const batches = await BatchService.getAllBatchesWithDetails(id, batch_number, start_date, 
//     end_date, status, intern_count,
//   supervisorId, supervisor_name, context);

  
//   if (!batches) {
// 		throw createError({
// 			status: 404,
// 			message: 'No batch found',
// 		})
// 	}
//   return { batches}
// }

// FILE: server/use-case/batches/get-all-batches.use-case.ts

import { BatchService } from "~/server/service/batches/get-all-batch.service";
import { type BatchWithInternCount } from '~/types/Types'
import { RequestContext } from "~/server/types/RequestContext";

type GetAllBatchResult = {
  batches: BatchWithInternCount[]
}

export const getAllBatchesUseCase = async (
  context: RequestContext
): Promise<GetAllBatchResult> => {
  // No DTO or validation needed for a "get all" operation
  // You can put the checkAuthentication back here later
  // await checkAuthentication(context); 

  const batches = await BatchService.getAllBatchesWithDetails();
  
  if (!batches) {
		throw createError({
			status: 404,
			message: 'No batches found',
		})
	}
  return { batches }
}