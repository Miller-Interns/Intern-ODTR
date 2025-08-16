// import type { Status } from '@prisma/client';
import type { Status } from '~/enums/status';
import type {Selectable} from 'kysely'

export type BatchWithInternCount = Selectable<Batch> & {
  end_date: Date | null ;
  intern_count: number;
  supervisor_name: string | null; 
}


export type User= {
    id: string;
    name: string | null;
};

export type Batch={
    id: string; 
    batch_number: string;
    start_date: Date;
    status: Status;
    // supervisorId: User
     supervisorId: string
};
export type ToastOptions = {
  title: string;
  description: string;
  timeout?: number;

};

export type MarkAsCompletedData={
id: string;
end_date: string
}
