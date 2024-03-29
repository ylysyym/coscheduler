import { DateTime, Interval } from 'luxon';
import { useSettingsStore } from '@/stores/settings';

const isSameDate = (interval: Interval): boolean => {
    return interval.count('day') <= 1;
};

export const formatInterval = (interval: Interval): string => {
    const settings = useSettingsStore();
    let result =
        formatTime(interval.start, settings.dateFormat, settings.timeFormat) +
        ' - ' +
        interval.end.toFormat(settings.timeFormat);
    if (!isSameDate(interval)) {
        const dayDifference = interval.count('day') - 1;
        result += ' (+' + dayDifference + ')';
    }

    return result;
};

export const formatTime = (
    time: DateTime,
    dateFormat: string,
    timeFormat: string
): string => {
    return time.toFormat(dateFormat + ' ' + timeFormat);
};
