import { TimeUnit } from './TimeUnit';

export const defaultTimeUnits: TimeUnit[] = [
    {
        shortDesc: '5m',
        longDesc: '5 minutes',
        minutes: 5,
    },
    {
        shortDesc: '15m',
        longDesc: '15 minutes',
        minutes: 15,
    },
    {
        shortDesc: '30m',
        longDesc: '30 minutes',
        minutes: 30,
    },
    {
        shortDesc: '1h',
        longDesc: '1 hour',
        minutes: 60,
    },
    {
        shortDesc: '1d',
        longDesc: '1 day',
        minutes: 24 * 60,
    },
];
