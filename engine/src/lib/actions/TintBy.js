import TimeableAction from './TimeableAction';

export default class TintBy extends TimeableAction {
    constructor(tint, time) {
        super(time);
        this.tint = tint;
        this.reset();
    }

    reset() {
        super.reset();
        this.ttint = null;
    }

    // if end return true, if not end return false
    update(container, delta) {
        const { tint } = container;
        if (this.ttint === null) {
            this.ttint = tint + this.tint;
        }
        container.tint += ((this.ttint - tint) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.tint = this.ttint;
        super.finish(container);
    }
}
