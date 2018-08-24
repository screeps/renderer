import TimeableAction from './TimeableAction';

export default class TintTo extends TimeableAction {
    constructor(tint, time) {
        super(time);
        this.tint = tint;
        this.reset();
    }

    update(container, delta) {
        container.tint = this._interpolateColor(container.tint, this.tint, delta);
        return super.update(container, delta);
    }

    finish(container) {
        container.tint = this.tint;
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
        return (r << 16) | (g << 8) | b;
    }
}
