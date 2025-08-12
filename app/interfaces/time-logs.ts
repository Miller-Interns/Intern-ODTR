export interface RawPendingLogQueryResult {
	id: string;
	intern_id: string;
	admin_id: string | null;
	status: boolean;
	admin_remarks: string | null;
	intern_notes: string | null;
	time_in: Date;
	time_out: Date | null;
	total_hours: number;
	intern: {
		id: string;
		name: string;
		role: string;
		intern_picture: string;
	};
}


export interface DashboardLog {
    id: string;
    status: boolean;
    time_in: string;
    time_out: string | null;
    total_hours: number;
    intern_notes: string | null;
    admin_remarks: string | null;
    intern_name: string;
    intern_picture: string | null;
}

export interface TimeLogEntry {
    id: string;
    intern_id: string;
    admin_id: string;
    status: boolean;
    admin_remarks: string | null;
    intern_notes: string | null;
    time_in: string; 
    time_out: string | null; 
    total_hours: number;
    intern: {
        id: string;
        name: string;
        role: string;
        intern_picture: string | null;
    };
}

export interface ApproveLogPayload {
	logId: string
	admin_remarks: string | null
}

export interface BulkApprovePayload {
  logs: ApproveLogPayload[];
}
