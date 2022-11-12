import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';

export interface AvailabilityScale {
    readonly title: string;
    readonly levels: AvailabilityLevel[];
}
