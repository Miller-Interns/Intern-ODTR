import type { Status } from '~/generated/prisma'

export interface InternDetails {
  id: string
  userId: string
  fullName: string
  lastName: string
  firstName: string
  middleName: string | null
  email: string
  contactNumber: string | null
  contactPerson: string | null
  contactPersonNumber: string | null
  school: string
  course: string
  year: string
  courseYear: string
  requiredHours: number
  hoursCompleted: number | null
  note: string | null
  role: string
  status: Status
  internPicture: string | null
}

export interface InternSummary {
  id: string;
  fullName: string;
  internPicture: string | null; 
  hoursCompleted: number | null;
  requiredHours: number;
}

export interface BatchData {
  details: {
    id: string;
    batchNumber: string;
    statusText: string;
  };
  interns: InternSummary[];
}
