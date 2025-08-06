import { updateInternAndUser } from '~/server/services/intern.service';

export async function updateInternDetailsUseCase(internId: string, requestBody: any) {
  const {
    userId,
    lastName,
    firstName,
    middleName,
    email,
    school,
    courseYear,
    contactNumber,
    contactPerson,
    contactPersonNumber,
    requiredHours,
    role,
    status,
  } = requestBody;
  if (!internId || !userId) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Intern ID or User ID is missing.' });
  }

  const combinedCourseYear = courseYear || '';
  const parts = combinedCourseYear.split(/\s*-\s*/);
  const parsedCourse = parts[0]?.trim() || '';
  const parsedYear = parts[1]?.trim() || '';

  const nameParts = [firstName, middleName].filter(Boolean).join(' ');
  const fullName = [lastName, nameParts].filter(Boolean).join(', ');

  const userDataToUpdate = {
    name: fullName,
    email: email,
  };

  const internDataToUpdate = {
    school,
    course: parsedCourse,
    year: parsedYear,
    contact_number: contactNumber,
    required_hours: Number(requiredHours), 
    emergency_contact_person: contactPerson,
    emergency_contact_number: contactPersonNumber,
    role: role,
    status: status,
  };
  
  await updateInternAndUser(userId, internId, userDataToUpdate, internDataToUpdate);

  return { message: 'Intern details updated successfully.' };
}