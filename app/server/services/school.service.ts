
import prisma from '~/server/utils/prisma';

export async function findUniqueSchools() {
  const schools = await prisma.intern.findMany({
    select: {
      school: true,
    },
    distinct: ['school'],
  });

  return schools;
}