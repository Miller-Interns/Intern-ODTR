import { PrismaClient } from '~/generated/prisma';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const internId = event.context.params?.id as string;

  const intern = await prisma.intern.findUnique({
    where: { id: internId },
    include: { user: true },
  });

  if (!intern) {
    throw createError({ statusCode: 404, statusMessage: 'Intern not found.' });
  }

  const fullName = intern.user.name || '';
  const nameParts = fullName.split(',');
  const lastName = nameParts[0]?.trim() || '';
  const firstAndMiddle = (nameParts[1] || '').trim().split(/\s+/);
  const firstName = firstAndMiddle.shift() || '';
  const middleName = firstAndMiddle.join(' '); 

  return {
    id: intern.id,
    userId: intern.user_id,
    fullName: intern.user.name,
    lastName: lastName,
    firstName: firstName,
    middleName: middleName,
    email: intern.user.email,
    contactNumber: intern.contact_number,
    contactPerson: intern.emergency_contact_person,
    contactPersonNumber: intern.emergency_contact_number,
    courseYear: `${intern.course}-${intern.year}`,
    course: intern.course,
    school: intern.school,
    year: intern.year,
    requiredHours: intern.required_hours,
    hoursCompleted: intern.hours_completed,
    note: intern.note,
    role: intern.role,
    status: intern.status,
    internPicture: intern.intern_picture,
  };
});