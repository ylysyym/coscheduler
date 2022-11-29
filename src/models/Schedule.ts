import { DateTime } from 'luxon';

export interface Schedule {
    title: string;
    blockDuration: number;
    blockCount: number;
    startTime: DateTime;
    levels: string[];
    entries: { [name: string]: number[] };
}
