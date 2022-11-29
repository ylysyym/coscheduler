import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { getScheduleById } from '@/api/schedules';
import { BlockData } from '@/models/BlockData';
import { AvailabilityLevel } from '@/models/AvailabilityLevel';
import { Schedule } from '@/models/Schedule';
import { useUiStore } from './ui';
import { useSettingsStore } from './settings';

interface ErrorData {
    hasError: boolean;
    error: Error;
}

type AvailabilityCount = { [availability: number]: number };

export const useScheduleStore = defineStore('schedule', {
    state: () => {
        return {
            schedules: {} as { [id: string]: Schedule },
            errors: {} as { [id: string]: ErrorData },
        };
    },

    actions: {
        async initialiseSchedule(id: string) {
            await getScheduleById(id)
                .then((schedule) => {
                    this.schedules[id] = {
                        title: schedule.title,
                        entries: schedule.entries,
                        levels: schedule.levels,
                        blockCount: schedule.blockCount,
                        blockDuration: schedule.blockDuration,
                        startTime: schedule.startTime,
                    };
                })
                .catch((err) => {
                    this.errors[id] = {
                        hasError: true,
                        error: err,
                    };
                });
        },

        blockAtIndex(names: string[], index: number): BlockData {
            const entries = Object.keys(this.entries)
                .filter((key) => names.includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: this.levels[this.entries[key][index]],
                    };
                }, {});

            return new BlockData(this.intervals[index], entries);
        },

        updateEntry(name: string, levels: number[]) {
            this.schedule.entries[name] = levels;
        },
    },

    getters: {
        schedule(): Schedule {
            const ui = useUiStore();
            return this.schedules[ui.scheduleId];
        },

        entries(): { [name: string]: number[] } {
            return this.schedule.entries;
        },

        people(): string[] {
            return Object.keys(this.entries);
        },

        intervals(): Interval[] {
            const result = [];
            const intervalDuration = Duration.fromObject({
                minutes: this.blockDuration,
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

        startTime(): DateTime {
            return this.schedule.startTime;
        },

        endTime(): DateTime {
            return this.startTime.plus({
                minutes: this.blockDuration * this.blockCount,
            });
        },

        levels(): AvailabilityLevel[] {
            return this.schedule.levels.map((label, index) => {
                return {
                    level: index,
                    color: this.colors[index],
                    label: label,
                };
            });
        },

        colors(): string[] {
            const settings = useSettingsStore();

            return this.schedule.levels.map((_, index) => {
                return settings.colorScale(
                    index / (this.schedule.levels.length - 1)
                );
            });
        },

        title(): string {
            return this.schedule.title;
        },

        blockCount(): number {
            return this.schedule.blockCount;
        },

        blockDuration(): number {
            return this.schedule.blockDuration;
        },

        hasError(): boolean {
            const ui = useUiStore();
            const errorData = this.errors[ui.scheduleId];
            return errorData !== undefined && errorData.hasError;
        },

        error(): Error {
            const ui = useUiStore();
            return this.errors[ui.scheduleId]?.error || new Error();
        },

        availabilityCounts(): AvailabilityCount[] {
            const result = [] as AvailabilityCount[];

            const defaultCounts: AvailabilityCount = {};

            for (let i = 1; i < this.levels.length; i++) {
                defaultCounts[i] = 0;
            }

            for (let i = 0; i < this.blockCount; i++) {
                const counts: AvailabilityCount = { ...defaultCounts };
                for (const person of this.people) {
                    const level = this.entries[person][i];
                    for (let j = level; j >= 1; j--) {
                        counts[j]++;
                    }
                }
                result.push(counts);
            }

            return result;
        },
    },
});
