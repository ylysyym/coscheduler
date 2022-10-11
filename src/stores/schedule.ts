import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { defaultAvailabilityScale } from '@/models/availability/defaultAvailabilityScale';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

const DEFAULT_INITIAL_LEVEL = 1;

export const useScheduleStore = defineStore('schedule', {
    state: () => {
        return {
            entries: {} as {
                [name: string]: number[];
            },
            currentEntry: [] as number[],
            scale: defaultAvailabilityScale,
            rowUnit: defaultTimeUnits['1d'],
            blockUnit: defaultTimeUnits['1h'],
            startTime: {} as DateTime,
            blockCount: 7 * 24,
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
        },

        initialiseBlockData() {
            this.currentEntry = [];
            for (let i = 0; i < this.blockCount; i++) {
                this.currentEntry.push(DEFAULT_INITIAL_LEVEL);
            }
        },

        changeLevel(blockIndex: number, level: number) {
            this.currentEntry[blockIndex] = level;
        },

        changeMultipleLevels(blocks: number[], level: number) {
            for (const id of blocks) {
                this.changeLevel(id, level);
            }
        },

        saveNew(name: string) {
            this.entries[name] = this.currentEntry;
            this.currentEntry = [];
        },

        currentLevel(index: number): AvailabilityLevel {
            const availabilityLevel = this.scale.levels.find((lvl) => {
                return lvl.level === this.currentEntry[index];
            });

            return availabilityLevel || this.scale.levels[0];
        },

        levels(index: number): AvailabilityLevel[] {
            const result = [];
            for (const key of Object.keys(this.entries)) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.entries[key][index];
                });
                if (availabilityLevel !== undefined) {
                    result.push(availabilityLevel);
                }
            }
            if (this.currentEntry.length > index) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.currentEntry[index];
                });

                if (availabilityLevel !== undefined) {
                    result.push(availabilityLevel);
                }
            }

            if (result.length === 0) {
                return [this.scale.levels[0]];
            }

            return result;
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
