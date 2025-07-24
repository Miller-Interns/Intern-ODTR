import type { Intern } from "~/types/intern.ts";

export type TimeLog = {
  id: string;
  intern: Intern;
  intern_id: string;
  timeIn: string;
  timeOut: string;
  remarks: string | null;
  status: boolean;
  admin_id: string;
};
