import prisma from '~/server/utils/prisma';

export async function findBatchById(batchId: string) {
  const batchDataFromDb = await prisma.batch.findUnique({
    where: {
      id: batchId,
    },
    select: {
      id: true,
      batch_number: true,
      status: true,
      start_date: true,
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

  return batchDataFromDb;
}