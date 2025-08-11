import type { Selectable } from 'kysely';
import type { Batch } from '../../app/server/db/types.d.ts';
import type { InternWithDetails, InternSummary } from './interns';
import type { TimeLogEntry } from './time-logs';


export interface ActiveInternsApiResponse {
    batch: Selectable<Batch>;
    interns: InternSummary[];
}

export interface ActiveInternsResponse {
    batch?: { status?: boolean }
    interns: InternSummary[]
}

export interface InternDetailsResponse {
    intern: InternWithDetails;
    timeLogs: TimeLogEntry[];
}

export interface BulkApprovalApiResponse {
    success: boolean;
    message: string;
}

