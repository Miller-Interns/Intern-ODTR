import z from 'zod'
import { checkAuthentication } from '../utils/check-authentication'
import { createSchemaValidator } from '../utils/create-schema-validator'
import { userService } from '../service/user.service'
import type { RequestContext } from '../types/RequestContext'

const dtoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  password: z.string().min(6).optional().or(z.literal('')),
  contact_number: z.string(),
  emergency_contact_person: z.string(),
  emergency_contact_number: z.string(),
  school: z.string(),
  course: z.string(),
  year: z.string(),
  required_hours: z.number(),
  role: z.string().optional(),
  notes: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)
type UpdateProfileDTO = z.infer<typeof dtoSchema>

export const updateInternProfileUseCase = async (dto: UpdateProfileDTO, context: RequestContext) => {
  const userId = await checkAuthentication(context)
  const { firstName, middleName, lastName, ...restOfData } = await validateDTO(dto)

  // Combine the name fields into a single 'name' string
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
  
  const payload = {
      ...restOfData,
      name: fullName
  };
  
  await userService.updateUserProfile(userId, payload);

  return { status: 'success' }
}