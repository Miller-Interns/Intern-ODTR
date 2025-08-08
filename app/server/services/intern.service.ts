import { Status } from '~/generated/prisma';
import prisma from '~/server/utils/prisma';

export async function updateInternPictureUrl(internId: string, imageUrl: string) {
  const updatedIntern = await prisma.intern.update({
    where: { id: internId },
    data: {
      intern_picture: imageUrl,
    },
  });

  return updatedIntern;
}

export async function findInternWithUserById(internId: string) {
  const intern = await prisma.intern.findUnique({
    where: { id: internId },
    include: { user: true },
  });

  if (!intern) {
    throw createError({ statusCode: 404, statusMessage: 'Intern not found.' });
  }

  return intern;
}

interface UserUpdateData {
  name: string;
  email: string;
}

interface InternUpdateData {
  school: string;
  course: string;
  year: string;
  contact_number: string;
  required_hours: number;
  emergency_contact_person: string;
  emergency_contact_number: string;
  role: string;
  status: Status;
}

export async function updateInternAndUser(
  userId: string,
  internId: string,
  userData: UserUpdateData,
  internData: InternUpdateData
) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: userData,
    }),
    prisma.intern.update({
      where: { id: internId },
      data: internData,
    }),
  ]);
}