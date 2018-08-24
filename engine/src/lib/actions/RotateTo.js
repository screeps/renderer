import TimeableAction from './TimeableAction';

export default class RotateTo extends TimeableAction {
    constructor(rotation, time) {
        super(time);
        this.rotation = rotation;
        this.reset();
    }

    update(container, delta) {
        const { rotation } = container;
        while (this.rotation - rotation > Math.PI) {
            this.rotation -= Math.PI * 2;
        }
        while (this.rotation - rotation < -Math.PI) {
            this.rotation += Math.PI * 2;
        }
        container.rotation += ((this.rotation - rotation) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.rotation = this.rotation;
        super.finish(container);
    }
}
