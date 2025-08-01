

import { db } from '~/server/db';
import { z } from 'zod';


const QuerySchema = z.object({
  id: z.string().min(1, { message: "An ID must be provided" }),
});

export default defineEventHandler(async (event) => {
  const query = getQuery(event);


  const validation = QuerySchema.safeParse(query);
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid query parameters." });
  }

  const { id: batchId } = validation.data;


  const batch = await db
    .selectFrom('batches')
    .where('id', '=', batchId)
    .selectAll()
    .executeTakeFirst(); 

  if (!batch) {
    throw createError({ statusCode: 404, statusMessage: 'Batch not found.' });
  }

  return batch;
});