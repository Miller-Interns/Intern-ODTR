import { z } from 'zod'
import { DashboardLogSchema, type DashboardLog, InternLogSchema, type InternLog, } from '../response/time-log.response';

function toDashboardResponse(log: DashboardLog): DashboardLog {
    return DashboardLogSchema.parse(log);
}

function toDashboardResponseArray(logs: DashboardLog[]): DashboardLog[] {
    return z.array(DashboardLogSchema).parse(logs);
}

function toInternLogResponse(log: InternLog): InternLog {
    return InternLogSchema.parse(log);
}

function toInternLogResponseArray(logs: InternLog[]): InternLog[] {
    return z.array(InternLogSchema).parse(logs);
}

export const timelogFactory = {
    toDashboardResponse,
    toDashboardResponseArray,
    toInternLogResponse,
    toInternLogResponseArray,
};