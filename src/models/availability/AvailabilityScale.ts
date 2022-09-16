export interface AvailabilityScale {
    levels: number;
    labels: {
        [level: number]: string;
    };
    colors: {
        [level: number]: string;
    };
}
