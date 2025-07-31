// File: server/api/batches/single.get.ts

import { db } from '~/server/db';
import { z } from 'zod';

// Define a schema for the query parameters we expect
const QuerySchema = z.object({
  id: z.string().min(1, { message: "An ID must be provided" }),
});

export default defineEventHandler(async (event) => {
  // ✅ 1. Get the query parameters from the URL
  const query = getQuery(event);

  // 2. Validate the query parameters
  const validation = QuerySchema.safeParse(query);
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid query parameters." });
  }

  const { id: batchId } = validation.data;

  // 3. Fetch a SINGLE object from the database using the ID
  const batch = await db
    .selectFrom('batches')
    .where('id', '=', batchId)
    .selectAll()
    .executeTakeFirst(); // .executeTakeFirst() gets one item, not an array

  // 4. If not found, throw a 404 error
  if (!batch) {
    throw createError({ statusCode: 404, statusMessage: 'Batch not found.' });
  }

  // 5. If found, return the single batch object
  return batch;
});