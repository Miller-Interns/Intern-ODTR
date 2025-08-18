export type TimeLog = {
	id: string;
	intern_id: string;
	time_in: Date;
	time_out: Date;
	total_hours: number;
	admin_remarks: string | null;
	intern_notes: string | null;
	status: boolean;
	admin_id: string;
}

export type RawPendingLogQueryResult = {
	id: string
	intern_id: string
	time_in: Date
	time_out: Date | null
	total_hours: number
	admin_remarks: string | null
	intern_notes: string | null
	status: boolean
	admin_id: string | null
	intern: {
		id: string
		name: string
		role: string
		intern_picture: string
	}
}

export type DashboardLog = {
	id: string
	intern_id: string
	time_in: string
	time_out: string | null
	total_hours: number
	admin_remarks: string | null
	intern_notes: string | null
	status: boolean
	admin_id: string
	intern_name: string
	intern_picture: string | null
}

export type InternLog = {
	id: string
	intern_id: string
	time_in: string
	time_out: string | null
	total_hours: number
	admin_remarks: string | null
	intern_notes: string | null
	status: boolean
	admin_id: string
	intern: {
		id: string
		name: string
		role: string
		intern_picture: string | null
	}
}

export type ApproveLogPayload = {
	logId: string
	admin_remarks: string | null
}

export type BulkApprovePayload = {
	logs: ApproveLogPayload[]
}
