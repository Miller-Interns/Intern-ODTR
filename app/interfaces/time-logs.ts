export interface RawPendingLogQueryResult {
    id: string;
    intern_id: string;
    admin_id: string | null;
    status: boolean;
    remarks: string | null;
    time_in: Date;
    time_out: Date | null;
    total_hours: number;
    overtime: number | null;
    intern_name: string | null;
    intern_role: string;
    intern_picture: string | null;
}

export interface TimeLogEntry {
    id: string;
    intern_id: string;
    admin_id: string | null;
    status: boolean;
    remarks: string | null;
    time_in: string;
    time_out: string | null;
    total_hours: number;
    overtime: number | null;
    intern: {
        id: string;
        name: string | null;
        role: string;
        intern_picture: string | null;
    };
}

export interface ApproveLogPayload {
    logId: string;
    remarks: string | null;
}

export interface BulkApprovePayload {
    logIds: string[];
    remarks: string | null;
}