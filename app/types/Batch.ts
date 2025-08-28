export type InternListItem = {
id: string;
fullName: string | null;
internPicture: string | null;
hoursCompleted: number | null;
requiredHours: number;
}

export type BatchDetailsData = {
details: {
id: string;
batchNumber: string;
statusText: string;
internCount: number;
startDate: string;
supervisorName: string;
};
interns: InternListItem[];
}

export type BatchListItem = {
  id: string;
  batchNumber: string;
  status: 'INCOMING' | 'ONGOING' | 'COMPLETED';
  supervisor: string;
  internCount: number;
}
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
