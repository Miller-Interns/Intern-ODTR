import type { Selectable } from 'kysely';
import type { Batch } from '../../app/server/db/types.d.ts';
import type { InternWithDetails } from './interns';
import type { TimeLogEntry } from './time-logs';


export interface ActiveInternsApiResponse {
    batch: Selectable<Batch>;
    interns: InternWithDetails[];
}

export interface ActiveInternsResponse {
    batch?: { status?: boolean }
    interns: InternWithDetails[]
}

export interface InternDetailsResponse {
    intern: InternWithDetails;
    timeLogs: TimeLogEntry[];
}

export interface BulkApprovalApiResponse {
    success: boolean;
    message: string;
}

