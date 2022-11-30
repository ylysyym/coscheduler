import { getScale } from 'color2k';
import createColormap from 'colormap';

const presetScale = (name: string) => {
    const colorMap = createColormap({
        colormap: name,
        nshades: 20,
        format: 'hex',
    });

    return getScale(...colorMap);
};

export const colorScale = (colorMap: string | string[]) => {
    if (Array.isArray(colorMap)) {
        return getScale(...colorMap);
    } else {
        return presetScale(colorMap);
    }
};
