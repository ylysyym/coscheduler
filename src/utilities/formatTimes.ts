import { DateTime, Interval } from 'luxon';

const isSameDate = (a: DateTime, b: DateTime): boolean => {
    return a.day === b.day && a.month === b.month && a.year === b.year;
};

export const formatInterval = (interval: Interval): string => {
    const a = interval.start;
    const b = interval.end;
    let result = a.toFormat('yyyy LLL dd (EEE), HH:mm') + ' - ';
    if (isSameDate(a, b)) {
        result += b.toFormat('HH:mm');
    } else {
        result += b.toFormat('yyyy LLL dd (EEE), HH:mm');
    }

    return result;
};
