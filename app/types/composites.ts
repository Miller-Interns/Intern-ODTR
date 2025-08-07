import type { Selectable } from 'kysely';
import type { TimeLog, Intern, User, Batch } from '../../app/server/db/types.d.ts';

export type PendingTimeLog = Omit<TimeLog, 'time_in' | 'time_out' | 'status' | 'total_hours' | 'overtime' | 'admin_id'> & {
  intern: {
    id: string;
    name: string | null;
    role: string;
    intern_picture: string | null;
  };
  time_in: string;
  time_out: string | null;
  status: boolean;
};

export type PendingLogQueryResult = {
  id: string;
  intern_id: string;
  admin_id: string | null;
  status: boolean;
  remarks: string | null;
  time_in: Date;
  time_out: Date | null;
  intern_name: string | null;
  intern_role: string;
  intern_picture: string | null;
  total_hours: number;
  overtime: number | null;
};

export type InternWithDetails = Selectable<Intern> & {
  user: Pick<User, 'name' | 'email'>;
  batch: Pick<Batch, 'batch_number'>;
  completed_hours: number;
  remaining_hours: number;
};

export type ActiveInternsApiResponse = {
  batch: Selectable<Batch>;
  interns: InternWithDetails[];
}

export type InternDetailsResponse = {
  intern: InternWithDetails;
  timeLogs: PendingTimeLog[];
};

export type InternQueryResult = Selectable<Intern> &
  Pick<User, 'name' | 'email'> & {
    completed_hours: number;
  };

export type InternDetailQueryResult = Selectable<Intern> &
  Pick<User, 'name' | 'email'> &
  Pick<Batch, 'batch_number'> & {
    completed_hours: number;
  };

export type TimeLogEntry = {
  id: string;
  intern_id: string;
  time_in: string;
  time_out: string | null;
  total_hours: number;
  overtime: number | null;
  remarks: string | null;
  status: boolean;
  admin_id: string | null;

  intern: {
    name: string | null;
    role: string;
    intern_picture: string | null;
  };
};
