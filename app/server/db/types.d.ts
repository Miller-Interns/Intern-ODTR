import type { ColumnType } from "kysely";
import {Status} from '~/enum/enums'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Status = (typeof Status)[keyof typeof Status];
export type Batch = {
    id: string;
    batch_number: string;
    start_date: Generated<Timestamp>;
    end_date: Timestamp | null;
    status: Generated<boolean>;
};
export type Intern = {
    id: string;
    user_id: string;
    batch_id: string;
    school: string;
    required_hours: number;
    status: Generated<Status>;
    course: Generated<string>;
    year: Generated<string>;
    contact_number: Generated<string>;
    emergency_contact_person: Generated<string>;
    emergency_contact_number: Generated<string>;
    role: Generated<string>;
    intern_picture: string | null;
    hours_completed: number | null;
    note: string | null;
};
export type TimeLog = {
    id: string;
    intern_id: string;
    time_in: Timestamp;
    time_out: Timestamp;
    overtime: number | null;
    total_hours: number;
    remarks: string | null;
    status: Generated<boolean>;
    admin_id: string;
};
export type User = {
    id: string;
    email: string;
    name: string | null;
    password: string | null;
    isAdmin: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type DB = {
    batches: Batch;
    interns: Intern;
    time_logs: TimeLog;
    users: User;
};
