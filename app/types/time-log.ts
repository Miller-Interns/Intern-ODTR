export type TimeLogForUI = {
  id: string;
  intern: { id:string; name: string; };
  intern_id: string;
  time_in: string;
  time_out: string | null;
  overtime?: number | null;
  remarks: string | null;
  status: boolean;
  admin_id: string;
  total_hours: number;
};