import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import prisma from '~/server/utils/prisma'
import { AddInternSchema, type AddInternDTO } from '~/types/crud-for-interns/Intern'
import { internService } from '~/server/service/crud-for-interns/interns/intern.service'
import { internFactory } from '~/server/factory/crud-for-interns/interns/intern.factory'
import type { RequestContext } from '~/server/types/RequestContext'
import type { Intern, User } from '~/server/db/types.d'
import type { Insertable } from 'kysely'

const validateDTO = createSchemaValidator(AddInternSchema)

export const addInternUseCase = async (dto: AddInternDTO, _context: RequestContext) => {
  const { 
    email, password, firstName, middleName, lastName, courseYear, school, requiredHours,
    ...restOfData
  } = await validateDTO(dto)

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw createError({ statusCode: 409, statusMessage: 'A user with this email address already exists.' })
  }

  const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : '';
  const displayName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');
  const hashedPassword = await bcrypt.hash(password, 10);
  const [course, year] = courseYear.split('-').map(part => part.trim());
  const schoolName = typeof school === 'object' ? school.label : school as string;

  const newUserId = randomUUID();
  const newInternId = randomUUID()

  const userData = {
    id: newUserId,
    email,
    name: displayName,
    password: hashedPassword,
  };

  const internData = {
    id: newInternId, 
    user_id: newUserId,
    batch_id: restOfData.batchId, 
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    course,
    year,
    school: schoolName,
    required_hours: requiredHours,
    contact_number: restOfData.contactNumber ?? 'N/A',
    emergency_contact_person: restOfData.emergencyContactPerson ?? 'N/A',
    emergency_contact_number: restOfData.emergencyContactNumber ?? 'N/A',
    role: restOfData.role ?? 'Web Developer',
    notes: restOfData.notes,
  };

   const newIntern = await internService.createInternAndUser({
    userData: userData as unknown as Insertable<User>,
    internData: internData as unknown as Omit<Insertable<Intern>, 'user_id'>,
  });

  return internFactory.toAddInternResponse(newIntern);
}