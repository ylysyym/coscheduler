import { Interval } from "luxon"
import { AvailabilityLevel } from "./AvailabilityLevel"

export class BlockData {
    public readonly interval: Interval;
    public readonly level: AvailabilityLevel;

    constructor(interval: Interval, level: AvailabilityLevel) {
        this.interval = interval;
        this.level = level;
    }
}
