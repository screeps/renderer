import TimeableAction from './TimeableAction';

export default class SkewTo extends TimeableAction {
    constructor(x, y, time) {
        super(time);
        this.x = x;
        this.y = y;
        this.reset();
    }

    update(container, delta) {
        const { skew } = container;
        const speedX = ((this.x - skew.x) / this.restTime) * delta;
        const speedY = ((this.y - skew.y) / this.restTime) * delta;
        container.skew.x += speedX;
        container.skew.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.skew.x = this.x;
        container.skew.y = this.y;
        super.finish(container);
    }
}
