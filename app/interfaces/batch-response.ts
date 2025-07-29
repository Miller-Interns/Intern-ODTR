import type { Status } from "@prisma/client";

export interface BatchApiResponse {
  success: true;
  batch: {
    id: string; 
    batch_number: string;
    start_date: Date;
    status: Status
  };
}