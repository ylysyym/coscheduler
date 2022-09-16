import { BUSY_COLOR, NEUTRAL_COLOR, AVAILABLE_COLOR } from '@/Colors';
import { AvailabilityScale } from './AvailabilityScale';

export const defaultAvailabilityScale: AvailabilityScale = {
    levels: 3,
    color(level: number) {
        switch (level) {
            case 1:
                return BUSY_COLOR;
            case 2:
                return NEUTRAL_COLOR;
            case 3:
                return AVAILABLE_COLOR;
            default:
                return '';
        }
    },
    label(level: number) {
        switch (level) {
            case 1:
                return 'Busy';
            case 2:
                return 'Maybe';
            case 3:
                return 'Available';
            default:
                return 'Unknown';
        }
    },
};
