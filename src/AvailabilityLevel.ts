import { lighten } from 'color2k';
import { NEUTRAL_COLOR, AVAILABLE_COLOR, BUSY_COLOR } from './Colors';

export class AvailabilityLevel {
    public level = 1; // one-indexed
    public readonly max: number;

    constructor(level = 1, scale = 3) {
        this.level = level;
        this.max = scale;
    }

    color(): string {
        const midpoint: number = (this.max + 1) / 2;
        if (this.level === midpoint) return NEUTRAL_COLOR;
        if (this.level === 1) return BUSY_COLOR;
        if (this.level === this.max) return AVAILABLE_COLOR;

        //const adjustment = Math.abs(midpoint - this.level) / this.max;
        if (this.level < midpoint) {
            const adjustment = (1.5 * (this.level - 1)) / this.max;
            return lighten(BUSY_COLOR, adjustment);
        } else {
            const adjustment = (1.5 * (this.max - this.level)) / this.max;
            return lighten(AVAILABLE_COLOR, adjustment);
        }
    }
}
