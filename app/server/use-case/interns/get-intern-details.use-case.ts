import { z } from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService } from '~/server/service/interns/intern.service'
import { internFactory } from '~/server/factory/interns/intern.factory'

const dtoSchema = z.object({ id: z.string().min(1) })
const validateDTO = createSchemaValidator(dtoSchema)

export const getInternDetailsUseCase = async (dto: { id: string }) => {
  const { id } = await validateDTO(dto)
  
  const internWithUser = await internService.findInternWithUserById(id)

  return internFactory.toInternDetailsResponse(internWithUser);
}