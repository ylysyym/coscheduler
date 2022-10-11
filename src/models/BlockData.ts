import { Interval } from 'luxon';
import { AvailabilityLevel } from './availability/AvailabilityLevel';

interface Entries {
    [name: string]: AvailabilityLevel;
}

export class BlockData {
    public readonly interval: Interval;
    public readonly entries: Entries;

    constructor(interval: Interval, entries: Entries) {
        this.interval = interval;
        this.entries = entries;
    }
}
