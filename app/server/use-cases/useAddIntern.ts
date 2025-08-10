import bcrypt from 'bcrypt'
import { z } from 'zod'
import { createInternAndUser } from '~/server/services/add-intern.service'
import type { InternRequestBody, InternCreationData } from '~/interfaces/interfaces'

const InternSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  school: z.string().min(1, { message: 'School is required.' }),
  courseYear: z.string().min(1, { message: 'Course and Year are required.' }),
  requiredHours: z.number().min(1, { message: 'Required hours must be greater than 0.' }),
  middleName: z.string().optional(),
  note: z.string().optional(),
  role: z.string().optional(),
  contactNumber: z.string().optional(),
  emergencyContactPerson: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
});

export async function createInternUseCase(requestBody: InternRequestBody) {
  const validationResult = InternSchema.safeParse(requestBody);

  

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validationResult.error.issues[0].message,
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    school,
    courseYear,
    requiredHours,
    middleName,
    note,
    role,
    contactNumber,
    emergencyContactPerson,
    emergencyContactNumber
  } = validationResult.data;


  const courseParts = courseYear.split(/\s*-\s*/).map(part => part.trim());
  if (courseParts.length !== 2 || !courseParts[0] || !courseParts[1]) {
		throw createError({});
	}

  const [course, year_level] = courseParts;
  const hashedPassword = await bcrypt.hash(password, 10);

  const internData: InternCreationData = {
    firstName,
    middleName, 
    lastName,
    email,
    hashedPassword,
    school,
    course,
    year: year_level,
    requiredHours,
    note,
    role,
    contactNumber,
    emergencyContactPerson,
    emergencyContactNumber,
  };

  const newIntern = await createInternAndUser(internData);
  return newIntern;
}