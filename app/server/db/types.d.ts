import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

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
    course: string;
    year: string;
    contact_number: string;
    emergency_contact_person: string;
    emergency_contact_number: string;
    required_hours: number;
    status: boolean;
    hours_completed: number;
    role: string | null;
    notes: string | null;
};
export type TimeLog = {
    id: string;
    intern_id: string;
    time_in: Timestamp;
    time_out: Timestamp | null;
    total_hours: number;
    admin_remarks: string | null;
    intern_notes: string | null;
    status: Generated<boolean>;
    admin_id: string | null;
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
