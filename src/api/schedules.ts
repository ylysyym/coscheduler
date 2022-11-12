export const getScheduleById = async (id: string) => {
    const request = await fetch(
        `${import.meta.env.VITE_API_URL}/schedules/${id}`,
        {
            method: 'GET',
        }
    );
    const response = await request.json();
};

export const createSchedule = () => {
    // create
};

export const updateSchedule = (entries: { [name: string]: number[] }) => {
    // update schedule
};
