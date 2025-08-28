import type { Intern } from '~/server/db/types.d' 
import { AddInternResponseSchema, type AddInternResponse } from '~/server/response/add_intern/add-intern.response'
import { InternDetailsResponseSchema, type InternDetailsResponse } from '~/server/response/interns/intern-details.response'
import type { InternWithUserAndBatchStatus } from '~/server/service/interns/intern.service'

function toAddInternResponse(intern: Intern): AddInternResponse {
  return AddInternResponseSchema.parse(intern);
}

function toInternDetailsResponse(internWithUser: InternWithUserAndBatchStatus): InternDetailsResponse {
  
  const viewModel = {
    userId: internWithUser.user_id,
    firstName: internWithUser.first_name,
    middleName: internWithUser.middle_name || '',
    lastName: internWithUser.last_name,
    email: internWithUser.email,
    internId: internWithUser.id,
    fullName: internWithUser.name || '',
    batchId: internWithUser.batch_id,
    contactNumber: internWithUser.contact_number,
    emergencyContactPerson: internWithUser.emergency_contact_person,
    emergencyContactNumber: internWithUser.emergency_contact_number,
    school: internWithUser.school,
    course: internWithUser.course,
    year: internWithUser.year,
    requiredHours: internWithUser.required_hours,
    role: internWithUser.role,
    notes: internWithUser.notes,
    status: internWithUser.status,
    internPicture: internWithUser.intern_picture,
    hoursCompleted: internWithUser.hours_completed,
    courseYear: `${internWithUser.course} - ${internWithUser.year}`,
  };

  return InternDetailsResponseSchema.parse(viewModel);
}


export const internFactory = {
  toAddInternResponse,
  toInternDetailsResponse,
}