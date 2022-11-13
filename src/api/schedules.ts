import { DateTime } from 'luxon';
import { Schedule } from '@/models/Schedule';
import { ScheduleParameters } from '@/models/ScheduleParameters';

// TODO: implement error handling

export const getScheduleById = async (id: string) => {
    const request = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'GET',
        }
    );
    const response = await request.json().catch((err) => {
        if (!request.ok) {
            throw `${request.status}: ${request.statusText}`;
        }
    });

    const schedule: Schedule = {
        title: response.title,
        startTime: DateTime.fromISO(response.startTime),
        blockCount: response.blockCount,
        blockDuration: response.blockDuration,
        scale: response.scale,
        entries: response.entries,
    };

    return schedule;
};

export const createSchedule = async (parameters: ScheduleParameters) => {
    const request = await fetch(`${import.meta.env.VITE_API_URL}/schedules`, {
        method: 'POST',
        body: JSON.stringify(parameters),
    });
    const response = await request.json();
    const location = request.headers.get('Location');

    return location?.split('/').pop();
};

export const updateSchedule = async (
    id: string,
    entries: { [name: string]: number[] }
) => {
    const request = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'PATCH',
            body: JSON.stringify({ entries }),
        }
    );
    const response = await request.json();
};
