import type { Status } from '~/generated/prisma'

export interface InternDetails {
  id: string
  userId: string
  fullName: string
  lastName: string
  firstName: string
  middleName: string | null
  email: string
  hashedPassword: string
  contactNumber: string 
  emergencyContactPerson: string 
  emergencyContactNumber: string 
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
    start_date: string;
    internCount: number;
    supervisor: string;
  };
  interns: InternSummary[];
}

export interface InternRequestBody {
	firstName: string
	middleName?: string
	lastName: string
	contactNumber: string
	email: string
	password: string
	school: string
	courseYear: string 
	requiredHours: number
  role?: string
  contact_number?: string
  emergencyContactPerson?: string
	emergencyContactNumber?: string
	note?: string
}

export interface InternCreationData {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  hashedPassword: string;
  school: string;
  course: string;
  year: string;
  requiredHours: number;
  note?: string | null;
  role?: string;
  contactNumber?: string;
  emergencyContactPerson?: string;
  emergencyContactNumber?: string;
}