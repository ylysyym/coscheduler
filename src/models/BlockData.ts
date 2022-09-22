import { Interval } from 'luxon';

export class BlockData {
    public readonly interval: Interval;
    public level: number;

    constructor(interval: Interval, level: number) {
        this.interval = interval;
        this.level = level;
    }
}
