import { BUSY_COLOR, NEUTRAL_COLOR, AVAILABLE_COLOR } from '@/Colors';
import { AvailabilityScale } from './AvailabilityScale';

export const defaultAvailabilityScale: AvailabilityScale = {
    levels: 3,
    colors: {
        '1': BUSY_COLOR,
        '2': NEUTRAL_COLOR,
        '3': AVAILABLE_COLOR,
    },
    labels: {
        '1': 'Busy',
        '2': 'Maybe',
        '3': 'Available',
    },
};
