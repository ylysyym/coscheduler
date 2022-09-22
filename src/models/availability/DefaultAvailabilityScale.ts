import {
    BUSY_COLOR,
    NEUTRAL_COLOR,
    AVAILABLE_COLOR,
} from '@/models/availability/Colors';
import { AvailabilityScale } from '@/models/availability/AvailabilityScale';

export const defaultAvailabilityScale: AvailabilityScale = {
    levels: [
        {
            level: 1,
            color: BUSY_COLOR,
            label: 'Busy',
        },
        {
            level: 2,
            color: NEUTRAL_COLOR,
            label: 'Maybe',
        },
        {
            level: 3,
            color: AVAILABLE_COLOR,
            label: 'Available',
        },
    ],
};
