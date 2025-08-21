import { z } from 'zod';

export const FormattedTimeLogSchema = z.object({
    date: z.string(),
    timeIn: z.string(),
    timeOut: z.string(),
    noOfHours: z.number(),
    approvedBy: z.string(),
});

export const ExportTimeLogsResponseSchema = z.object({
    intern: z.object({
        name: z.string(),
        officialHours: z.string(),
    }),
    timelogs: z.array(FormattedTimeLogSchema),
});

export type FormattedTimeLog = z.infer<typeof FormattedTimeLogSchema>;
export type ExportTimeLogsResponse = z.infer<typeof ExportTimeLogsResponseSchema>;