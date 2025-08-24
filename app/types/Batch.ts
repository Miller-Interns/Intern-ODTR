export const Status = {
    INCOMING: "INCOMING",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED"
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export type Batch = {
    id: string;
    batch_number: string;
    start_date: Date;
    end_date: Date | null;
    status: Status;
    supervisorId: string;
};