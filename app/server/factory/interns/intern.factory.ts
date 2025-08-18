import type { Intern } from '@prisma/client'
import { AddInternResponseSchema, type AddInternResponse } from '~/server/response/add_intern/add-intern.response'
import type { InternWithUser } from '~/server/service/interns/intern.service'
import { InternDetailsResponseSchema, type InternDetailsResponse } from '~/server/response/interns/intern-details.response'

function toAddInternResponse(intern: Intern): AddInternResponse {
  return AddInternResponseSchema.parse(intern);
}

function toInternDetailsResponse(internWithUser: InternWithUser): InternDetailsResponse {
  let firstName = '';
  let middleName = '';
  let lastName = '';
  const nameFromDb = (internWithUser.name as string) || '';
  
  if (nameFromDb.includes(',')) {
    const nameParts = nameFromDb.split(',');
    lastName = nameParts[0]?.trim() || '';
    firstName = nameParts[1]?.trim() || '';
    middleName = nameParts[2]?.trim() || '';
  } else {
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

  const viewModel = {
    userId: internWithUser.user_id,
    firstName,
    middleName,
    lastName,
    email: internWithUser.email,
    internId: internWithUser.id,
    batchId: internWithUser.batch_id,
    contactNumber: internWithUser.contact_number,
    emergencyContactPerson: internWithUser.emergency_contact_person,
    emergencyContactNumber: internWithUser.emergency_contact_number,
    school: internWithUser.school,
    course: internWithUser.course,
    year: internWithUser.year,
    requiredHours: internWithUser.required_hours,
    role: internWithUser.role,
    note: internWithUser.note,
    status: internWithUser.status,
    internPicture: internWithUser.intern_picture,
    hoursCompleted: internWithUser.hours_completed,
    fullName: finalFullName,
    courseYear: `${internWithUser.course} - ${internWithUser.year}`,
  };

  return InternDetailsResponseSchema.parse(viewModel);
}

export const internFactory = {
  toAddInternResponse,
  toInternDetailsResponse,
}
