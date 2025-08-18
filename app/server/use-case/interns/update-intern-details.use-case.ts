import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService } from '~/server/service/interns/intern.service'
import { internFactory } from '~/server/factory/interns/intern.factory'
import { UpdateInternSchema, type UpdateInternDTO } from '~/types/intern'

const validateDTO = createSchemaValidator(UpdateInternSchema)

export const updateInternDetailsUseCase = async (dto: UpdateInternDTO) => {
  const validatedData = await validateDTO(dto)
  
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
  } = validatedData
  
  const displayName = [lastName, firstName, middleName].filter(Boolean).join(',');
  const [course, year] = courseYear.split('-').map((part: string) => part.trim())

  const updatedInternWithUser = await internService.updateInternAndUser({
    userId,
    internId,
    userData: { name: displayName, email },
    internData: { 
      required_hours: requiredHours,
      contact_number: contactNumber,
      emergency_contact_person: emergencyContactPerson,
      emergency_contact_number: emergencyContactNumber,
      school: school,
      role: role,
      notes: note,
      course, 
      year 
    },
  })

  return internFactory.toInternDetailsResponse(updatedInternWithUser);
}