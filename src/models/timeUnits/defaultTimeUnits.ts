import { TimeUnit } from './TimeUnit';

export const defaultTimeUnits: { [key: string]: TimeUnit } = {
    '5m': {
        description: '5 minutes',
        minutes: 5,
        blockUnit: true,
    },
    '15m': {
        description: '15 minutes',
        minutes: 15,
        blockUnit: true,
    },
    '30m': {
        description: '30 minutes',
        minutes: 30,
        blockUnit: true,
    },
    '1h': {
        description: '1 hour',
        minutes: 60,
        blockUnit: true,
    },
    '1d': {
        description: '1 day',
        minutes: 24 * 60,
        blockUnit: true,
    },
    '1w': {
        description: '1 week',
        minutes: 7 * 24 * 60,
        blockUnit: false,
    },
    '1M': {
        description: '1 month',
        minutes: 31 * 24 * 60,
        blockUnit: false,
    },
};
