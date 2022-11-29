import { getScale } from 'color2k';
import createColormap from 'colormap';

export const presetScale = (name: string) => {
    const colorMap = createColormap({
        colormap: name,
        nshades: 20,
        format: 'hex',
    });

    return getScale(...colorMap);
};
