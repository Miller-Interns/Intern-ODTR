import { z } from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService } from '~/server/service/interns/intern.service'

const dtoSchema = z.object({
  userId: z.string().uuid(),
  internId: z.string().min(1),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  middleName: z.string().optional(),
  email: z.string().email(),
  contactNumber: z.string().optional(),
  emergencyContactPerson: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  school: z.string().min(1),
  courseYear: z.string().min(3),
  requiredHours: z.number().positive(),
  role: z.string().optional(),
  note: z.string().optional(),
})
const validateDTO = createSchemaValidator(dtoSchema)

export const updateInternDetailsUseCase = async (dto: any) => {
  const { 
    userId,
    internId,
    firstName,
    lastName,
    middleName,
    email,
    courseYear,
    requiredHours,
    contactNumber,
    emergencyContactPerson,
    emergencyContactNumber,
    school,
    role,
    note
  } = await validateDTO(dto)

  const displayName = [lastName, firstName, middleName ].filter(Boolean).join(',');

  const [course, year] = courseYear.split('-').map((part: string) => part.trim())

  return internService.updateInternAndUser({
    userId,
    internId,
    userData: { name: displayName, email },
    internData: { 
      required_hours: requiredHours,
      contact_number: contactNumber,
      emergency_contact_person: emergencyContactPerson,
      emergency_contact_number: emergencyContactNumber,
      school,
      role,
      note,
      course, 
      year 
    },
  })
}