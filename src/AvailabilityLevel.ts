//import { lighten } from 'color2k';
import { AvailabilityScale } from './models/availability/AvailabilityScale';
import { defaultAvailabilityScale } from './models/availability/DefaultAvailabilityScale';

export class AvailabilityLevel {
    public level = 1; // one-indexed
    public readonly scale: AvailabilityScale;

    constructor(level = 1, scale = defaultAvailabilityScale) {
        this.level = level;
        this.scale = scale;
    }

    get color(): string {
        if (this.level in this.scale.colors) {
            return this.scale.colors[this.level];
        }

        return 'black';
        // TODO: rewrite function to interpolate color
        /*
        const midpoint: number = (this.scale.levels + 1) / 2;
        if (this.level === midpoint) return NEUTRAL_COLOR;
        if (this.level === 1) return BUSY_COLOR;
        if (this.level === this.scale.levels) return AVAILABLE_COLOR;

        //const adjustment = Math.abs(midpoint - this.level) / this.max;
        if (this.level < midpoint) {
            const adjustment = (1.5 * (this.level - 1)) / this.scale.levels;
            return lighten(BUSY_COLOR, adjustment);
        } else {
            const adjustment =
                (1.5 * (this.scale.levels - this.level)) / this.scale.levels;
            return lighten(AVAILABLE_COLOR, adjustment);
        }
        */
    }
}
