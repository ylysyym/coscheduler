import { DateTime } from 'luxon';

export interface ScheduleParameters {
    readonly title: string;
    readonly blockDuration: number;
    readonly blockCount: number;
    readonly startTime: DateTime;
    readonly levels: string[];
}
