import { PrismaClient } from '~/generated/prisma';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const batchId = getRouterParam(event, 'id') as string;

  if (!batchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A Batch ID is required.',
    });
  }

  try {

    const batchDataFromDb = await prisma.batch.findUnique({
      where: {
        id: batchId,
      },
      select: {
        id: true,
        batch_number: true,
        status: true,
        Intern: {     
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
            hours_completed: true,
            required_hours: true, 
            intern_picture: true,   
          },
        },
      },
    });

    if (!batchDataFromDb) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Batch not found.',
      });
    }

    const response = {
      details: {
        id: batchDataFromDb.id,
        batchNumber: batchDataFromDb.batch_number,
        statusText: batchDataFromDb.status ? 'Ongoing' : 'Inactive',
      },
      interns: batchDataFromDb.Intern.map((intern) => ({
        id: intern.id,
        fullName: intern.user.name,
        internPicture: intern.intern_picture,
        hoursCompleted: intern.hours_completed,
        requiredHours: intern.required_hours,
      })),
    };

    return response;
    
  } catch (error) {
    console.error('Failed to fetch batch details:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch batch details.',
    });
  }
});