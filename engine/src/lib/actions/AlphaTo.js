import TimeableAction from './TimeableAction';

export default class AlphaTo extends TimeableAction {
    constructor(alpha, time) {
        super(time);
        this.alpha = alpha;
        this.reset();
    }

    // if end return true, if not end return false
    update(container, delta) {
        const { alpha } = container;
        container.alpha += ((this.alpha - alpha) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.alpha = this.alpha;
        super.finish(container);
    }
}
