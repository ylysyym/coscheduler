import { DateTime } from 'luxon';

export enum TimeBreakpoint {
    // what each row on the grid represents
    None,
    Hour,
    Day,
    Week,
    Month,
}

export type GridIndexMap = number[][];

const isBreakpointStart = (time: DateTime, breakpoint: TimeBreakpoint) => {
    switch (breakpoint) {
        case TimeBreakpoint.Hour:
            return time.minute === 0;
        case TimeBreakpoint.Day:
            return time.hour === 0;
        case TimeBreakpoint.Week:
            return time.weekday === 1;
        case TimeBreakpoint.Month:
            return time.day === 1;
        default:
            return true;
    }
};

export const getColumnLabels = (
    breakpoint: TimeBreakpoint,
    cols: number,
    interval: number
): string[] => {
    const result: string[] = [];
    let startTime = DateTime.now().set({
        hour: 0,
        minute: 0,
        day: 1,
    });
    for (let i = 0; i < cols; i++) {
        if (breakpoint === TimeBreakpoint.Hour) {
            result.push(startTime.toFormat(':mm'));
        } else if (breakpoint === TimeBreakpoint.Day) {
            result.push(startTime.toFormat('HH'));
        }
        startTime = startTime.plus({
            minutes: interval,
        });
    }

    return result;
};

export const getRowLabels = (
    breakpoint: TimeBreakpoint,
    start: DateTime,
    cols: number,
    interval: number,
    blocks: number
): string[] => {
    const result: string[] = [];
    for (let i = 0; i < blocks; i += cols) {
        switch (breakpoint) {
            case TimeBreakpoint.Day:
                result.push(start.toFormat('LLL dd'));
        }
        start = start.plus({
            minutes: cols * interval,
        });
    }

    return result;
};

const getStartOffset = (
    start: DateTime,
    breakpoint: TimeBreakpoint,
    interval: number
): number => {
    let offset = 0;

    while (!isBreakpointStart(start, breakpoint)) {
        start = start.minus({
            minutes: interval,
        });
        offset++;
    }

    return offset;
};

const getTotalBlocks = (
    start: DateTime,
    end: DateTime,
    interval: number
): number => {
    let count = 0;
    while (start < end) {
        start = start.plus({
            minutes: interval,
        });
        count++;
    }

    return count;
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
    end: DateTime,
    interval: number,
    breakpoint: TimeBreakpoint,
    columns: number
): GridIndexMap => {
    const blocks = getTotalBlocks(start, end, interval);
    const offset = getStartOffset(start, breakpoint, interval);

    return createGrid(blocks, columns, offset);
};
