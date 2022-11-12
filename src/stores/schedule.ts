import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { light5RedGreenScale } from '@/models/availability/defaultAvailabilityScales';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';
import { BlockData } from '@/models/BlockData';
import { getScheduleById } from '@/api/schedules';

export const useScheduleStore = defineStore('schedule', {
    state: () => {
        return {
            entries: {} as {
                [name: string]: number[];
            },
            scale: light5RedGreenScale,
            rowUnit: defaultTimeUnits['1d'],
            blockUnit: defaultTimeUnits['1h'],
            startTime: {} as DateTime,
            blockCount: 0,
            title: '',
            description: '',
        };
    },

    actions: {
        initialiseSchedule() {
            const currentDate = DateTime.now().set({
                minute: 0,
                second: 0,
                millisecond: 0,
            });
            this.startTime = currentDate;
            this.blockCount = 10 * 7 * 24;
            this.title = 'Basic schedule';
            this.description = 'This schedule is used for testing purposes.';
        },

        blockAtIndex(names: string[], index: number): BlockData {
            const entries = Object.keys(this.entries)
                .filter((key) => names.includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: this.scale.levels[this.entries[key][index]],
                    };
                }, {});

            return new BlockData(this.intervals[index], entries);
        },

        async get(id: string) {
            await getScheduleById(id);
        },
    },

    getters: {
        people(): string[] {
            return Object.keys(this.entries);
        },

        intervals(): Interval[] {
            const result = [];
            const intervalDuration = Duration.fromObject({
                minutes: this.blockUnit.minutes,
            });

            let intervalStart = this.startTime;
            for (let i = 0; i < this.blockCount; i++) {
                const blockInterval: Interval = Interval.after(
                    intervalStart,
                    intervalDuration
                );
                result.push(blockInterval);

                intervalStart = blockInterval.end;
            }

            return result;
        },

        endTime(): DateTime {
            return this.startTime.plus({
                minutes: this.blockUnit.minutes * this.blockCount,
            });
        },
    },
});
