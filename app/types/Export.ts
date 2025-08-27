export type FormattedTimeLog = {
    date: string;
    timeIn: string;
    timeOut: string;
    noOfHours: number;
    approvedBy: string;
}

export type ExportData = {
    intern: {
        name: string;
        officialHours: string;
    };
    timelogs: FormattedTimeLog[];
}