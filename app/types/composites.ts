import type { Selectable } from 'kysely';
import type { TimeLog, Intern, User, Batch } from '../../app/server/db/types.d.ts';

export type TimeLogForUI = Omit<TimeLog, 'time_in' | 'time_out' | 'status'> & {
  intern: {
    id: string;
    name: string | null;
  };
  time_in: string;
  time_out: string | null;
  status: boolean;
};

//to modify when the avatar column will be added to the db
export type InternWithDetails = Intern & {
  user: Pick<User, 'name' | 'email'> & {
    avatar?: string | null;
  };
  completed_hours: number;
}

export type ActiveInternsApiResponse = {
  batch: Selectable<Batch>;
  interns: InternWithDetails[];
}

export type InternDetailsResponse = {
  intern: InternWithDetails;
  timeLogs: TimeLogForUI[];
};
