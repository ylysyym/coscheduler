import { DateTime, Duration, Interval } from "luxon";
import { defineStore } from "pinia"
import { AvailabilityLevel } from "@/AvailabilityLevel";
import { BlockData } from "@/BlockData";

const DEFAULT_INITIAL_LEVEL = 1;

export const useGridStateStore = defineStore("gridState", {
    state: () => {
        return {
            blockData: [] as BlockData[],
            maxLevel: 3,
        }
    },

    actions: {
        initialiseBlockData(blockCount: number, startTime: DateTime, intervalDuration: Duration) {
            this.blockData = [];

            let intervalStart = startTime;

            for (let i = 0; i < blockCount; i++) {
                const defaultLevel = new AvailabilityLevel(DEFAULT_INITIAL_LEVEL, this.maxLevel);
                const blockInterval: Interval = Interval.after(intervalStart, intervalDuration);
                const blockData: BlockData = new BlockData(blockInterval, defaultLevel);
                this.blockData.push(blockData);

                intervalStart = blockInterval.end;
            }
        },

        level(index: number): AvailabilityLevel {
            if (index >= this.blockData.length) {
                return new AvailabilityLevel();
            }

            return this.blockData[index].level;
        },

        changeLevel(blockIndex: number, level: number) {
            this.blockData[blockIndex].level.level = level;
        }
    },
});