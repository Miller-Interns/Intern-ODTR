import { z } from 'zod';
import { TimeLogSchema } from '../db/schema';

/**
 * Schema for updating an existing TimeLog.
 * All fields are optional. Typically used by an admin.
 */
export const UpdateTimeLogSchema = TimeLogSchema.pick({
    admin_id: true, // Required for authorization/logging the change
    admin_remarks: true,
    status: true,
    time_in: true,
    time_out: true,
}).partial(); // .partial() makes all fields optional

export type UpdateTimeLogDto = z.infer<typeof UpdateTimeLogSchema>