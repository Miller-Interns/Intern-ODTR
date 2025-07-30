import type { Status } from '@prisma/client';


export interface BatchApiResponse {
  success: true;
  batch: {
    id: string; 
    batch_number: string;
    start_date: Date;
    status: Status;
    supervisorId: Supervisor
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
    end_date: Date;
    status: Status;
    supervisorId: Supervisor
}

export interface Supervisor {
  id: string;
  name: string | null;
}

export const supervisors: Supervisor[] = [
  { id: '015084bc-bec3-4373-aec3-729fba0a825a', name: "Alyssa Palencia" },
  { id:'0908da60-40f8-4b20-948c-dca792a64860',  name: "Karl Zablan" },
  { id: 'cef438de-359c-4802-97ca-66d74dd50cf1', name: "Seth Cornelio" },
  { id: 'ada24d94-f49e-4af1-91f0-64056ad149eb', name: "Sheena Balatero" },

];
