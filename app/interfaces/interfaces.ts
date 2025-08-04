import type { Status } from '@prisma/client';


export interface BatchApiResponse {
  success: true;
  batch: {
    id: string; 
    batch_number: string;
    start_date: Date;
    status: Status;
    supervisorId: User
  };
}

export interface BatchWithInternCount extends Batch {
  intern_count: number;
  supervisor_name: string | null; 
}


export interface User {
    id: string;
    name: string | null;
};

export interface Batch{
    id: string; 
    batch_number: string;
    start_date: Date;
    end_date: Date | null;
    status: Status;
    supervisorId: User
}
export interface ToastOptions {
  title: string;
  description: string;
  timeout?: number;

}

