import { DateTime } from 'luxon';
import { Schedule } from '@/models/Schedule';
import { ScheduleParameters } from '@/models/ScheduleParameters';

// TODO: implement error handling

export const getScheduleById = async (id: string) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'GET',
        }
    );

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    const schedule: Schedule = {
        title: json.title,
        startTime: DateTime.fromISO(json.startTime),
        blockCount: json.blockCount,
        blockDuration: json.blockDuration,
        scale: json.scale,
        entries: json.entries,
    };

    return schedule;
};

export const createSchedule = async (parameters: ScheduleParameters) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/schedules`, {
        method: 'POST',
        body: JSON.stringify(parameters),
    });

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    const location = response.headers.get('Location');

    if (location === null) {
        throw new Error('Location is null');
    }

    return location.split('/').pop() || '';
};

export const updateSchedule = async (
    id: string,
    entries: { [name: string]: number[] }
) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'PATCH',
            body: JSON.stringify({ entries }),
        }
    );

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }
};
