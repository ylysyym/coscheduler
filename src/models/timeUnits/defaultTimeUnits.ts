import { TimeUnit } from './TimeUnit';

export const defaultTimeUnits: { [key: string]: TimeUnit } = {
    '5m': {
        description: '5 minutes',
        minutes: 5,
    },
    '15m': {
        description: '15 minutes',
        minutes: 15,
    },
    '30m': {
        description: '30 minutes',
        minutes: 30,
    },
    '1h': {
        description: '1 hour',
        minutes: 60,
    },
    '1d': {
        description: '1 day',
        minutes: 24 * 60,
    },
};
