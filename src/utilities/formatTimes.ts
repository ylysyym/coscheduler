import { DateTime, Interval } from 'luxon';
import { useSettingsStore } from '@/stores/settings';

const isSameDate = (a: DateTime, b: DateTime): boolean => {
    return a.day === b.day && a.month === b.month && a.year === b.year;
};

export const formatInterval = (interval: Interval): string => {
    const settings = useSettingsStore();
    const a = interval.start;
    const b = interval.end;
    let result = a.toFormat(settings.timestampFormat) + ' - ';
    if (isSameDate(a, b)) {
        result += b.toFormat(settings.timeFormat);
    } else {
        result += b.toFormat(settings.timestampFormat);
    }

    return result;
};
