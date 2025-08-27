import { z } from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService, type InternWithUserAndBatchStatus } from '~/server/service/interns/intern.service'
import { internFactory } from '~/server/factory/interns/intern.factory'
import type { InternDetails } from '~/types/Intern'

const dtoSchema = z.object({ id: z.string().min(1) })
const validateDTO = createSchemaValidator(dtoSchema)

export const getInternDetailsUseCase = async (dto: { id: string }) => {
  const { id } = await validateDTO(dto)
  const internWithUser = await internService.findInternWithUserById(id)
  const batchStatus = internWithUser.batch_status as unknown as InternDetails['status'];

  if (batchStatus === 'COMPLETED') {
    internWithUser.status = 'COMPLETED' as unknown as typeof internWithUser.status;
  }
  
  return internFactory.toInternDetailsResponse(internWithUser);
}