import type { Selectable } from "kysely"
import type { TimeLog } from '../db/types'

export type RawPendingLogQueryResult = Selectable<TimeLog> & {
    intern_name: string | null;
    intern_role: string | null;
    intern_picture: string | null;
};