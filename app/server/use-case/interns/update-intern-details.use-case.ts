import bcrypt from 'bcrypt' // <-- 1. Import bcrypt
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService } from '~/server/service/interns/intern.service'
import { internFactory } from '~/server/factory/interns/intern.factory'
import { UpdateInternSchema, type UpdateInternDTO } from '~/types/Intern'

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
    password,
    courseYear,
    requiredHours,
    contactNumber,
    emergencyContactPerson,
    emergencyContactNumber,
    school,
    role,
    notes
  } = validatedData
  
  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : '';
  const displayName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');
  const [course, year] = courseYear.split('-').map((part: string) => part.trim())
  const userDataToUpdate: { name: string; email: string; password?: string } = { 
    name: displayName, 
    email 
  };

  if (password && password.length > 0) {
    userDataToUpdate.password = await bcrypt.hash(password, 10);
  }

  const updatedInternWithUser = await internService.updateInternAndUser({
    userId,
    internId,
    userData: userDataToUpdate,
    internData: { 
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      required_hours: requiredHours,
      contact_number: contactNumber,
      emergency_contact_person: emergencyContactPerson,
      emergency_contact_number: emergencyContactNumber,
      school: school,
      role: role,
      notes: notes,
      course, 
      year 
    },
  })

  return internFactory.toInternDetailsResponse(updatedInternWithUser);
}