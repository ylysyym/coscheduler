import { defineStore } from 'pinia';
import { useScheduleStore } from './schedule';

type BlockRange = [number, number];

export const useFilterStore = defineStore('filter', {
    state: () => {
        return {
            minimumAvailability: 0,
            minimumPeople: 1,
            minimumDuration: 1,
        };
    },

    actions: {},

    getters: {
        longestBlockRanges(): BlockRange[] {
            const schedule = useScheduleStore();
            const counts = schedule.availabilityCounts;

            const result = [] as BlockRange[];
            let startIndex = 0;
            for (let i = 0; i < counts.length; i++) {
                if (counts[i][this.minimumAvailability] >= this.minimumPeople) {
                    continue;
                }

                const endIndex = i - 1;
                if (endIndex - startIndex + 1 >= this.minimumDuration) {
                    result.push([startIndex, endIndex]);
                }
                startIndex = i + 1;
            }
            if (startIndex < counts.length) {
                result.push([startIndex, counts.length - 1]);
            }

            return result.sort((a, b) => {
                return b[1] - b[0] - (a[1] - a[0]);
            });
        },
    },
});
