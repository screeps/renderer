import TimeableAction from './TimeableAction';

export default class FadeOut extends TimeableAction {
    constructor(time) {
        super(time);
        this.alpha = 0;
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
    }
}
