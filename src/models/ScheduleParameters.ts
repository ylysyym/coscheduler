import { DateTime } from 'luxon';

export interface ScheduleParameters {
    title: string;
    blockDuration: number;
    blockCount: number;
    startTime: DateTime;
    levels: string[];
}
