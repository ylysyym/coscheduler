import { AvailabilityScale } from './models/availability/AvailabilityScale';
import { defaultAvailabilityScale } from './models/availability/DefaultAvailabilityScale';

export class AvailabilityLevel {
    public readonly level: number; // one-indexed
    public readonly label: string;
    public readonly color: string;

    constructor(
        level = 1,
        scale: AvailabilityScale = defaultAvailabilityScale
    ) {
        this.level = level;
        this.label = scale.label(this.level);
        this.color = scale.color(this.level);
    }
}
