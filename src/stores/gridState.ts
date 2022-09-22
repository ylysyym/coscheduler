import { DateTime, Duration, Interval } from 'luxon';
import { defineStore } from 'pinia';
import { AvailabilityLevel } from '@/models/availability/AvailabilityLevel';
import { BlockData } from '@/models/BlockData';
import { defaultAvailabilityScale } from '@/models/availability/DefaultAvailabilityScale';

const DEFAULT_INITIAL_LEVEL = 1;

export const useGridStateStore = defineStore('gridState', {
    state: () => {
        return {
            blockData: [] as BlockData[],
            scale: defaultAvailabilityScale,
        };
    },

    actions: {
        initialiseBlockData(
            blockCount: number,
            startTime: DateTime,
            intervalDuration: Duration
        ) {
            this.blockData = [];

            let intervalStart = startTime;

            for (let i = 0; i < blockCount; i++) {
                const blockInterval: Interval = Interval.after(
                    intervalStart,
                    intervalDuration
                );
                const blockData: BlockData = new BlockData(
                    blockInterval,
                    DEFAULT_INITIAL_LEVEL
                );
                this.blockData.push(blockData);

                intervalStart = blockInterval.end;
            }
        },

        level(index: number): AvailabilityLevel {
            return this.scale.levels[this.blockData[index].level];
        },

        changeLevel(blockIndex: number, level: number) {
            this.blockData[blockIndex].level = level;
        },

        changeMultipleLevels(blocks: number[], level: number) {
            for (const id of blocks) {
                this.changeLevel(id, level);
            }
        },
    },
});
