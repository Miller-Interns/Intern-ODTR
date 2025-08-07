import { findBatchById } from '~/server/services/batch.service';

export async function getBatchDetailsUseCase(batchId: string) {
  if (!batchId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A Batch ID is required.',
    });
  }

  const batchDataFromDb = await findBatchById(batchId);

  const response = {
    details: {
      id: batchDataFromDb.id,
      batchNumber: batchDataFromDb.batch_number,
      statusText: batchDataFromDb.status,
      start_date: batchDataFromDb.start_date.toISOString().split('T')[0],
      internCount: batchDataFromDb.Intern.length,
      supervisor: batchDataFromDb.intern_supervisor.name,
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
}