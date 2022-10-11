import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { BlockData } from '@/models/BlockData';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { defaultAvailabilityScale } from '@/models/availability/defaultAvailabilityScale';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';

const DEFAULT_INITIAL_LEVEL = 1;

export const useScheduleStore = defineStore('schedule', {
    state: () => {
        return {
            entries: {} as {
                [name: string]: BlockData[];
            },
            currentEntry: [] as BlockData[],
            scale: defaultAvailabilityScale,
            rowUnit: defaultTimeUnits['1d'],
            blockUnit: defaultTimeUnits['1h'],
            startTime: {} as DateTime,
            endTime: {} as DateTime,
        };
    },

    actions: {
        initialiseEndpoints() {
            const currentDate = DateTime.now().set({
                minute: 0,
                second: 0,
                millisecond: 0,
            });
            this.startTime = currentDate;
            this.endTime = currentDate.plus({
                days: 8,
            });
        },

        initialiseBlockData() {
            const intervalDuration = Duration.fromObject({
                minutes: this.blockUnit.minutes,
            });
            this.currentEntry = [];

            let intervalStart = this.startTime;
            while (intervalStart < this.endTime) {
                const blockInterval: Interval = Interval.after(
                    intervalStart,
                    intervalDuration
                );
                const blockData: BlockData = new BlockData(
                    blockInterval,
                    DEFAULT_INITIAL_LEVEL
                );
                this.currentEntry.push(blockData);

                intervalStart = blockInterval.end;
            }
        },

        changeLevel(blockIndex: number, level: number) {
            this.currentEntry[blockIndex].level = level;
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
                return lvl.level === this.currentEntry[index].level;
            });

            return availabilityLevel || this.scale.levels[0];
        },

        levels(index: number): AvailabilityLevel[] {
            const result = [];
            for (const key of Object.keys(this.entries)) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.entries[key][index].level;
                });
                if (availabilityLevel !== undefined) {
                    result.push(availabilityLevel);
                }
            }
            if (this.currentEntry.length > index) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.currentEntry[index].level;
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
    },
});
