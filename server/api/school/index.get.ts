import { PrismaClient } from '~/generated/prisma'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  try {
    const interns = await prisma.intern.findMany({
      select: {
        school: true,
      },
      distinct: ['school'], 
    })

    const schoolNames = interns
      .map(intern => intern.school)
      .filter(school => school); 

    console.log('Returning school names:', schoolNames); 

    return schoolNames
  } catch (error) {
    console.error('API Error: Failed to fetch schools:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch the list of schools.',
    })
  }
})