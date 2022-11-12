import { DateTime } from 'luxon';
import { AvailabilityScale } from './availability/AvailabilityScale';

export interface Schedule {
    title: string;
    blockDuration: number;
    blockCount: number;
    startTime: DateTime;
    scale: AvailabilityScale;
    entries: { [name: string]: number[] };
}
