import { PrismaClient } from '~/generated/prisma';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const internId = getRouterParam(event, 'id') as string;
  const body = await readBody(event);

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
  } = body;

  if (!internId || !userId) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Missing ID.' });
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

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: userDataToUpdate,
      }),
      
      prisma.intern.update({
        where: { id: internId },
        data: {
          school,
          course: parsedCourse, 
          year: parsedYear,  
          contact_number: contactNumber,
          required_hours: requiredHours,
          emergency_contact_person: contactPerson,
          emergency_contact_number: contactPersonNumber,
          role,
        },
      }),
    ]);

    return { status: 'success', message: 'Intern details updated successfully.' };

  } catch (error) {
    console.error('Failed to update intern details:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not update intern details.' });
  }
});