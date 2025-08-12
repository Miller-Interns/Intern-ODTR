import type { Selectable } from 'kysely';
import type { Intern, User, Batch , Status, TimeLog} from '../../app/server/db/types.d.ts';

export interface InternQueryRow extends Selectable<Intern> {
    name: User['name'];
    email: User['email'];
    batch_number: Batch['batch_number']; 
}

export interface InternWithDetails extends Omit<Selectable<Intern>, 'hours_completed'> {
    user: Pick<User, 'name' | 'email'>;
    batch: Pick<Batch, 'batch_number'>;
    completed_hours: number;
    remaining_hours: number;
}

export interface ActiveInternRow {
    id: Intern['id'];
    user_id: Intern['user_id'];
    batch_id: Intern['batch_id'];
    required_hours: Intern['required_hours'];
    intern_picture: Intern['intern_picture'];
    status: Intern['status'];
    name: User['name'];
    email: User['email'];
    batch_number: Batch['batch_number'];
    completed_hours: number;
}

export interface InternSummary {
    id: string;
    user_id: string;
    batch_id: string;
    required_hours: number;
    intern_picture: string | null;
    status: Status; 

    user: {
        name: string | null;
        email: string;
    };
    batch: {
        batch_number: string;
    };

    completed_hours: number;
    remaining_hours: number;
}

export interface InternLogs extends Omit<Selectable<TimeLog>, 'time_in' | 'time_out'> {
    time_in: string
	time_out: string | null
    intern: ActiveInternRow
}