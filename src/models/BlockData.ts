import { Interval } from 'luxon';
import { AvailabilityLevel } from './AvailabilityLevel';

export interface BlockData {
    readonly interval: Interval;
    readonly entries: Record<string, AvailabilityLevel>;
}
