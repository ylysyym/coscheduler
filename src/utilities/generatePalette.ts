import { ColorPalette } from '@/models/palettes/ColorPalette';

const UNKNOWN_COLOR = '#ddd'; // TODO: change based on dark mode etc.

export const generatePalette = (
    scale: (val: number) => string,
    levels: number
): ColorPalette => {
    const result = {} as ColorPalette;
    result[0] = UNKNOWN_COLOR;
    for (let i = 0; i < levels; i++) {
        result[i + 1] = scale(i / (levels - 2));
    }

    return result;
};
