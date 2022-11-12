import { Schedule } from '@/models/Schedule';
import { ScheduleParameters } from '@/models/ScheduleParameters';
import { DateTime } from 'luxon';

export const getScheduleById = async (id: string) => {
    const request = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'GET',
        }
    );
    const response = await request.json();

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

export const updateSchedule = (entries: { [name: string]: number[] }) => {
    // update schedule
};
