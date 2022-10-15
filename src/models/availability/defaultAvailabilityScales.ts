import { mix } from 'color2k';
import {
    BUSY_COLOR,
    NEUTRAL_COLOR,
    AVAILABLE_COLOR,
    UNKNOWN_COLOR,
} from '@/models/availability/colors';
import { AvailabilityScale } from '@/models/availability/AvailabilityScale';

export const light3RedGreenScale: AvailabilityScale = {
    levels: [
        {
            level: 0,
            color: UNKNOWN_COLOR,
            label: 'Unknown',
            hidden: true,
        },
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

export const light5RedGreenScale: AvailabilityScale = {
    levels: [
        {
            level: 0,
            color: UNKNOWN_COLOR,
            label: 'Unknown',
            hidden: true,
        },
        {
            level: 1,
            color: '#f22b28',
            label: 'Busy',
        },
        {
            level: 2,
            color: '#f98b32',
            label: 'Slightly busy',
        },
        {
            level: 3,
            color: NEUTRAL_COLOR,
            label: 'Maybe',
        },
        {
            level: 4,
            color: '#9fe546',
            label: 'Somewhat available',
        },
        {
            level: 5,
            color: '#3ee050',
            label: 'Available',
        },
    ],
};
