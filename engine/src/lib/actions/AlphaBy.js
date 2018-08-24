import TimeableAction from './TimeableAction';

export default class AlphaBy extends TimeableAction {
    constructor(alpha, time) {
        super(time);
        this.alpha = alpha;
        this.reset();
    }

    reset() {
        super.reset();
        this.talpha = null;
    }

    // if end return true, if not end return false
    update(container, delta) {
        const { alpha } = container;
        if (this.talpha === null) {
            this.talpha = alpha + this.alpha;
        }
        container.alpha += ((this.talpha - alpha) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.alpha = this.talpha;
        super.finish(container);
    }
}
