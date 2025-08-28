import { z } from 'zod'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { batchService } from '~/server/service/batches/batch.service'
import type { RequestContext } from '~/server/types/RequestContext'

const dtoSchema = z.object({
  id: z.string().min(1, 'Batch ID cannot be empty'),
})
const validateDTO = createSchemaValidator(dtoSchema)

export const getBatchDetailsUseCase = async (dto: { id: string }, _context: RequestContext) => {
  
  const { id } = await validateDTO(dto)
  
  const batch = await batchService.getBatchAndSupervisor(id)

  if (!batch) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Batch not found',
    })
  }

  const interns = await batchService.getInternsByBatchId(id)

  const formattedStartDate = batch.start_date
    ? new Intl.DateTimeFormat('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(batch.start_date as unknown as Date))
    : 'N/A';

  const batchDetailsViewModel = {
    details: {
      id: batch.id,
      batchNumber: batch.batch_number,
      statusText: batch.status,
      internCount: interns.length,
      startDate: formattedStartDate,
      supervisorName: batch.supervisorName ?? 'N/A',
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

  return batchDetailsViewModel
}