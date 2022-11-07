import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { light5RedGreenScale } from '@/models/availability/defaultAvailabilityScales';
import { defaultTimeUnits } from '@/models/timeUnits/defaultTimeUnits';
import { BlockData } from '@/models/BlockData';

const DEFAULT_INITIAL_LEVEL = 1;

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

        initialiseBlockData(name: string) {
            this.entries[name] = [];
            for (let i = 0; i < this.blockCount; i++) {
                this.entries[name].push(DEFAULT_INITIAL_LEVEL);
            }
        },

        changeLevel(name: string, blockIndex: number, level: number) {
            this.entries[name][blockIndex] = level;
        },

        changeMultipleLevels(name: string, blocks: Set<number>, level: number) {
            for (const id of blocks) {
                this.changeLevel(name, id, level);
            }
        },

        level(name: string, index: number): AvailabilityLevel {
            const availabilityLevel = this.scale.levels.find((lvl) => {
                return lvl.level === this.entries[name][index];
            });
            if (availabilityLevel !== undefined) {
                return availabilityLevel;
            }

            return this.scale.levels[0];
        },

        blockAtIndex(names: string[], index: number): BlockData {
            const entries = Object.fromEntries(
                Object.entries(this.entries)
                    .filter(([key, val]) => names.includes(key))
                    .map(([key, val]) => [key, this.scale.levels[val[index]]])
            );
            return new BlockData(this.intervals[index], entries);
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
