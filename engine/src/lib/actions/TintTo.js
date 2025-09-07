import TimeableAction from './TimeableAction';

// Helper function to validate color values
function validateColor(color) {
    if (typeof color === 'number') {
        return Math.min(0xFFFFFF, Math.max(0, Math.floor(color)));
    }
    return color;
}

export default class TintTo extends TimeableAction {
    constructor(tint, time) {
        super(time);
        this.tint = validateColor(tint);
        this.reset();
    }

    update(container, delta) {
        container.tint = this._interpolateColor(container.tint, this.tint, delta);
        return super.update(container, delta);
    }

    finish(container) {
        container.tint = validateColor(this.tint);
        super.finish(container);
    }

    _interpolateColor(fromTint, targetTint, delta) {
        const fromRGB = TintTo._getRGB(fromTint);
        const toRGB = TintTo._getRGB(targetTint);

        const result = {};
        result.r = fromRGB.r + (((toRGB.r - fromRGB.r) / this.restTime) * delta);
        result.g = fromRGB.g + (((toRGB.g - fromRGB.g) / this.restTime) * delta);
        result.b = fromRGB.b + (((toRGB.b - fromRGB.b) / this.restTime) * delta);

        return TintTo._packRGB(result);
    }

    static _getRGB(color) {
        /* eslint-disable no-bitwise */
        return {
            r: color >>> 16,
            g: (color & 0x00ff00) >>> 8,
            b: color & 0x0000ff,
        };
        /* eslint-enable no-bitwise */
    }

    static _packRGB({ r, g, b }) {
        // eslint-disable-next-line no-bitwise
        // Clamp RGB components to valid range (0-255) to prevent invalid color values
        const clampedR = Math.min(255, Math.max(0, Math.floor(r)));
        const clampedG = Math.min(255, Math.max(0, Math.floor(g)));
        const clampedB = Math.min(255, Math.max(0, Math.floor(b)));
        return (clampedR << 16) | (clampedG << 8) | clampedB;
    }
}
