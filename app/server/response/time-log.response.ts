import { z } from 'zod';

export const DashboardLogSchema = z.object({
    id: z.string(),
    status: z.boolean(),
    time_in: z.iso.datetime(),
    time_out: z.iso.datetime(),
    total_hours: z.number(),
    intern_notes: z.string().nullable(),
    admin_remarks: z.string().nullable(),
    intern_name: z.string(),
    intern_picture: z.string().nullable(),
});

export const InternLogSchema = z.object({
    id: z.string(),
    intern_id: z.string(),
    admin_id: z.string().nullable(),
    status: z.boolean(),
    admin_remarks: z.string().nullable(),
    intern_notes: z.string().nullable(),
    time_in: z.iso.datetime(),
    time_out: z.iso.datetime(),
    total_hours: z.number(),
    intern: z.object({
        id: z.string(),
        name: z.string(),
        role: z.string(),
        intern_picture: z.string().nullable(),
    }),
});

export type DashboardLog = z.infer<typeof DashboardLogSchema>;
export type InternLog = z.infer<typeof InternLogSchema>;