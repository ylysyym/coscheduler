import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { BlockData } from '@/models/BlockData';
import { DisplaySchema } from '@/models/DisplaySchema';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { defaultAvailabilityScale } from '@/models/availability/defaultAvailabilityScale';

const DEFAULT_INITIAL_LEVEL = 1;

export const useGridStateStore = defineStore('gridState', {
    state: () => {
        return {
            blockData: {} as {
                [name: string]: BlockData[];
            },
            currentBlockData: [] as BlockData[],
            scale: defaultAvailabilityScale,
            display: DisplaySchema.Day,
            units: 60,
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
                minutes: this.units,
            });
            this.currentBlockData = [];

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
                this.currentBlockData.push(blockData);

                intervalStart = blockInterval.end;
            }
        },

        currentLevel(index: number): AvailabilityLevel {
            const availabilityLevel = this.scale.levels.find((lvl) => {
                return lvl.level === this.currentBlockData[index].level;
            });

            return availabilityLevel || this.scale.levels[0];
        },

        levels(index: number): AvailabilityLevel[] {
            const result = [];
            for (const key of Object.keys(this.blockData)) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.blockData[key][index].level;
                });
                if (availabilityLevel !== undefined) {
                    result.push(availabilityLevel);
                }
            }
            if (this.currentBlockData.length > index) {
                const availabilityLevel = this.scale.levels.find((lvl) => {
                    return lvl.level === this.currentBlockData[index].level;
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

        changeLevel(blockIndex: number, level: number) {
            this.currentBlockData[blockIndex].level = level;
        },

        changeMultipleLevels(blocks: number[], level: number) {
            for (const id of blocks) {
                this.changeLevel(id, level);
            }
        },

        saveNew(name: string) {
            this.blockData[name] = this.currentBlockData;
            this.currentBlockData = [];
        },
    },

    getters: {
        people(): string[] {
            return Object.keys(this.blockData);
        },
    },
});
