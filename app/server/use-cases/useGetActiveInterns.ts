import type { Kysely } from 'kysely';
import type { DB } from '../db/types';
import type { ActiveInternsApiResponse } from '../../interfaces/api';
import type { InternWithDetails } from '../../interfaces/interns';
import { getActiveBatch, getInternsByBatchId } from '../services/intern.service';

export async function useGetActiveInterns(db: Kysely<DB>): Promise<ActiveInternsApiResponse> {
    const activeBatch = await getActiveBatch(db);

    if (!activeBatch) {
        throw new Error('No active batch found.');
    }

    const internsData = await getInternsByBatchId(db, activeBatch.id);

    const interns: InternWithDetails[] = internsData.map((row) => {
        const { name, email, completed_hours, ...internBase } = row;

        const completed = parseFloat(completed_hours as any) || 0;
        const required = parseFloat(internBase.required_hours as any) || 0;
        const remaining_hours = required - completed;

        return {
            ...internBase,
            user: { name, email },
            batch: { batch_number: activeBatch.batch_number },
            completed_hours: completed,
            remaining_hours,
        };
    });

    return {
        batch: activeBatch,
        interns: interns,
    };
}