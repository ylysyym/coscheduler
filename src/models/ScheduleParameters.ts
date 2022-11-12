import { DateTime } from 'luxon';
import { AvailabilityScale } from './availability/AvailabilityScale';

export interface ScheduleParameters {
    title: string;
    blockDuration: number;
    blockCount: number;
    startTime: DateTime;
    scale: AvailabilityScale;
}
