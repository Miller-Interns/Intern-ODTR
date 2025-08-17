import bcrypt from 'bcrypt'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import type { RequestContext } from '~/server/types/RequestContext'
import prisma from '~/server/utils/prisma'
import { AddInternSchema, type AddInternDTO} from '~/types/Intern'

const validateDTO = createSchemaValidator(AddInternSchema)

export const addInternUseCase = async (dto: AddInternDTO, _context: RequestContext) => {
  const validatedData = await validateDTO(dto)

  const {
    email,
    password,
    firstName,
    middleName,
    lastName,
    courseYear,
    requiredHours,
    batchId,
    contactNumber,
    emergencyContactPerson,
    emergencyContactNumber,
    school,
    ...internPayload
  } = validatedData

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 409, statusMessage: 'A user with this email address already exists.' })
  }

  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : '';
  const fullname = [lastName, firstName, middleName].filter(Boolean).join(',');

  const hashedPassword = await bcrypt.hash(password, 10)
  const courseYearParts = courseYear.split('-').map(part => part.trim());

  if (courseYearParts.length < 2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid "Course and Year Level" format. Please use "Course - Year" (e.g., "BSCPE - 3rd Year").'
    });
  }
  const [course, year] = courseYearParts;
  const schoolName = typeof school === 'object' && school.label ? school.label : school as string;


  return prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        name: fullname,
        password: hashedPassword,
      },
    })

    const newIntern = await tx.intern.create({
      data: {
        user_id: newUser.id,
        batch_id: batchId,
        course,
        year,
        required_hours: requiredHours,
        contact_number: contactNumber ?? 'N/A',
        emergency_contact_person: emergencyContactPerson ?? 'N/A',
        emergency_contact_number: emergencyContactNumber ?? 'N/A',
        role: internPayload.role ?? 'Web Developer',
        note: internPayload.note,
        school: schoolName,
      },
    })

    return newIntern
  })
}