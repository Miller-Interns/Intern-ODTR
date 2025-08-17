import { z } from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { internService, type InternWithUser } from '~/server/service/interns/intern.service'
import type { InternDetails } from '~/types/Intern'

const dtoSchema = z.object({ id: z.string().min(1) })
const validateDTO = createSchemaValidator(dtoSchema)

export const getInternDetailsUseCase = async (dto: { id: string }) => {
  const { id } = await validateDTO(dto)
  const internWithUser: InternWithUser = await internService.findInternWithUserById(id)

  let firstName = '';
  let middleName = '';
  let lastName = '';
  const nameFromDb = internWithUser.name || '';
  
   if (nameFromDb.includes(',')) {
    const nameParts = nameFromDb.split(',');
    lastName = nameParts[0]?.trim() || '';
    firstName = nameParts[1]?.trim() || '';
    middleName = nameParts[2]?.trim() || '';
  }

  else {
    const nameParts = nameFromDb.split(' ').filter(Boolean);
    if (nameParts.length > 0) {
      firstName = nameParts.shift() || ''; 
      if (nameParts.length > 0) {
        lastName = nameParts.pop() || ''; 
      }
      middleName = nameParts.join(' '); 
    }
  }

  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : '';
  const finalFullName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');

  const viewModel: InternDetails = {
    userId: internWithUser.user_id as unknown as string,
    firstName,
    middleName,
    lastName,
    email: internWithUser.email as unknown as string,
    internId: internWithUser.id as unknown as string,
    batchId: internWithUser.batch_id as unknown as string,
    contactNumber: internWithUser.contact_number as unknown as string | null,
    emergencyContactPerson: internWithUser.emergency_contact_person as unknown as string | null,
    emergencyContactNumber: internWithUser.emergency_contact_number as unknown as string | null,
    school: internWithUser.school as unknown as string,
    course: internWithUser.course as unknown as string,
    year: internWithUser.year as unknown as string,
    requiredHours: internWithUser.required_hours as unknown as number,
    role: internWithUser.role as unknown as string,
    note: internWithUser.note as unknown as string | null,
    status: internWithUser.status as unknown as 'INCOMING' | 'ONGOING' | 'COMPLETED',
    internPicture: internWithUser.intern_picture as unknown as string | null,
    hoursCompleted: internWithUser.hours_completed as unknown as number | null,
    fullName: finalFullName,
    courseYear: '',
  }
  viewModel.courseYear = `${viewModel.course} - ${viewModel.year}`;
  return viewModel
}