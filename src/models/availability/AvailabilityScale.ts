export interface AvailabilityScale {
    levels: number;
    label(level: number): string;
    color(level: number): string;
}
