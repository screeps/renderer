import TimeableAction from './TimeableAction';

export default class RotateBy extends TimeableAction {
    constructor(rotation, time) {
        super(time);
        this.rotation = rotation;
        this.reset();
    }

    reset() {
        super.reset();
        this.trotation = null; // target rotation
    }

    update(container, delta) {
        const { rotation } = container;

        if (this.trotation === null) {
            this.trotation = rotation + this.rotation;
        }
        container.rotation += ((this.trotation - rotation) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.rotation = this.trotation;
        super.finish(container);
    }
}
