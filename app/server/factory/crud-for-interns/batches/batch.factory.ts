import { BatchListResponseSchema, type BatchListResponse } from '~/server/response/crud-for-interns/batches/batch-list.response'
import { BatchDetailsResponseSchema, type BatchDetailsResponse } from '~/server/response/crud-for-interns/batches/batch-details.response'
import type { KyselyBatchListItem, BatchAndSupervisor, InternWithUser } from '~/server/service/crud-for-interns/batches/batch.service'

function toBatchListResponse(rawBatches: KyselyBatchListItem[]): BatchListResponse {
  const viewModel = rawBatches.map(batch => ({
    id: batch.id,
    batchNumber: batch.batch_number,
    status: batch.status,
    supervisor: batch.supervisorName ?? 'N/A',
    internCount: Number(batch.internCount),
  }));
  return BatchListResponseSchema.parse(viewModel);
}

function toBatchDetailsResponse(batch: BatchAndSupervisor, interns: InternWithUser[]): BatchDetailsResponse {
  const formattedStartDate = batch.start_date
    ? new Intl.DateTimeFormat('en-US', { }).format(new Date(batch.start_date as unknown as Date))
    : 'N/A';

  const viewModel = {
    details: {
      id: batch.id,
      batchNumber: batch.batch_number,
      statusText: batch.status,
      internCount: interns.length,
      startDate: formattedStartDate,
      supervisorName: batch.supervisorName ?? 'N.A',
    },
    interns: interns.map((intern) => {
      const nameParts = intern.fullName?.split(',') || [];
      const lastName = nameParts[0]?.trim() || '';
      const firstName = nameParts[1]?.trim() || '';
      const middleName = nameParts[2]?.trim() || '';
      const middleInitial = middleName ? `${middleName.charAt(0).toUpperCase()}.` : '';
      const finalDisplayName = [firstName, middleInitial, lastName].filter(Boolean).join(' ');

      return {
        id: intern.id,
        fullName: finalDisplayName,
        internPicture: intern.intern_picture,
        hoursCompleted: intern.hours_completed,
        requiredHours: intern.required_hours,
      }
    }),
  }
  return BatchDetailsResponseSchema.parse(viewModel);
}

export const batchFactory = {
  toBatchListResponse,
  toBatchDetailsResponse,
}