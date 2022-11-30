import { DateTime } from 'luxon';

export interface Schedule {
    readonly title: string;
    readonly blockDuration: number;
    readonly blockCount: number;
    readonly startTime: DateTime;
    readonly levels: string[];
    readonly entries: Record<string, number[]>;
}
