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