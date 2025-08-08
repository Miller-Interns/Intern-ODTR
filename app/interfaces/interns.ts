import type { Selectable } from 'kysely';
import type { Intern, User, Batch } from '../../app/server/db/types.d.ts';

export interface InternQueryRow extends Selectable<Intern> {
    name: User['name'];
    email: User['email'];
    batch_number?: Batch['batch_number'];
    completed_hours: number;
}

export interface InternWithDetails extends Selectable<Intern> {
    user: Pick<User, 'name' | 'email'>;
    batch: Pick<Batch, 'batch_number'>;
    completed_hours: number;
    remaining_hours: number;
}

