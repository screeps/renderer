import TimeableAction from './TimeableAction';

export default class PivotTo extends TimeableAction {
    constructor(x, y, time) {
        super(time);
        this.x = x;
        this.y = y;
        this.reset();
    }

    update(container, delta) {
        const { pivot } = container;
        const speedX = ((this.x - pivot.x) / this.restTime) * delta;
        const speedY = ((this.y - pivot.y) / this.restTime) * delta;
        container.pivot.x += speedX;
        container.pivot.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.pivot.x = this.x;
        container.pivot.y = this.y;
        super.finish(container);
    }
}
