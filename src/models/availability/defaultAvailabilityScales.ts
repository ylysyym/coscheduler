import { AvailabilityScale } from '@/models/availability/AvailabilityScale';

const NEUTRAL_COLOR = '#ffeb3b';
const BUSY_COLOR = '#ff3d00';
const AVAILABLE_COLOR = '#64dd17';
const UNKNOWN_COLOR = '#ddd';

export const light3RedGreenScale: AvailabilityScale = {
    title: 'Red-green 3',
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
    title: 'Red-green 5',
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

export const viridis5Scale: AvailabilityScale = {
    title: 'Viridis 5',
    levels: [
        {
            level: 0,
            color: UNKNOWN_COLOR,
            label: 'Unknown',
            hidden: true,
        },
        {
            level: 1,
            color: '#440154',
            label: 'Busy',
        },
        {
            level: 2,
            color: '#3b528b',
            label: 'Somewhat busy',
        },
        {
            level: 3,
            color: '#21918c',
            label: 'Maybe',
        },
        {
            level: 4,
            color: '#5ec962',
            label: 'Somewhat free',
        },
        {
            level: 5,
            color: '#fde725',
            label: 'Free',
        },
    ],
};

export const defaultScales = [
    light5RedGreenScale,
    light3RedGreenScale,
    viridis5Scale,
];
