import { useBreakpoints } from '@vueuse/core';

const breakpoints = useBreakpoints({
    large: 900,
});

export const isSmallScreen = breakpoints.smaller('large');
