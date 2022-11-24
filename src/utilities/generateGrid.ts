import { DateTime } from 'luxon';

type GridIndexMap = number[][];

const isFirstColumn = (time: DateTime, rowDuration: number) => {
    if (rowDuration >= 7 * 24 * 60) {
        return time.weekday === 1;
    }

    const totalMinutes = time.minute + time.hour * 60;
    return totalMinutes % rowDuration === 0;
};

export const rowDuration = (minutes: number) => {
    if (minutes <= 5) {
        return 60;
    } else if (minutes <= 15) {
        return 6 * 60;
    } else if (minutes <= 30) {
        return 12 * 60;
    } else if (minutes < 12 * 60) {
        return 24 * 60;
    } else {
        return 7 * 24 * 60;
    }
};

export const rowStartTimes = (
    rowDuration: number,
    startTime: DateTime,
    interval: number,
    rowCount: number
): DateTime[] => {
    const times: DateTime[] = [];
    let rowStartTime = startTime;
    while (!isFirstColumn(rowStartTime, rowDuration)) {
        rowStartTime = rowStartTime.minus({
            minutes: interval,
        });
    }
    for (let i = 0; i < rowCount; i++) {
        times.push(rowStartTime);
        rowStartTime = rowStartTime.plus({
            minutes: rowDuration,
        });
    }

    return times;
};

const getStartOffset = (
    start: DateTime,
    rowDuration: number,
    interval: number
): number => {
    let offset = 0;

    while (!isFirstColumn(start, rowDuration)) {
        start = start.minus({
            minutes: interval,
        });
        offset++;
    }

    return offset;
};

const createGrid = (
    blocks: number,
    cols: number,
    offset: number
): GridIndexMap => {
    const grid: GridIndexMap = [];
    let row: number[] = new Array(offset).fill(-1);
    for (let i = 0; i < blocks; i++) {
        if (row.length === cols) {
            grid.push(row);
            row = [];
        }
        row.push(i);
    }

    while (row.length > 0 && row.length < cols) {
        row.push(-1);
    }
    if (row.length > 0) {
        grid.push(row);
    }

    return grid;
};

export const generateGrid = (
    start: DateTime,
    blockCount: number,
    interval: number,
    rowDuration: number,
    columns: number
): GridIndexMap => {
    const offset = getStartOffset(start, rowDuration, interval);

    return createGrid(blockCount, columns, offset);
};
