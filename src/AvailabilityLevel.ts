import { lighten } from "color2k"
import { NEUTRAL_COLOR, AVAILABLE_COLOR, BUSY_COLOR } from "./Colors"

class AvailabilityLevel {
    level: number = 1; // one-indexed
    max: number;

    constructor(level: number, scale: number) {
        this.level = level;
        this.max = scale;
    }

    color(): string {
        if (this.level === 1) return BUSY_COLOR;
        if (this.level === this.max) return AVAILABLE_COLOR;

        const midpoint: number = (this.max + 1) / 2;
        if (this.level === midpoint) return NEUTRAL_COLOR;

        const adjustment = Math.abs(midpoint - this.level) / this.max;
        if (this.level < midpoint) {
            return lighten(BUSY_COLOR, adjustment);
        } else {
            return lighten(AVAILABLE_COLOR, adjustment);
        }
    }
}
