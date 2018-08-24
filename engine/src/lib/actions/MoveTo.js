import TimeableAction from './TimeableAction';

export default class MoveTo extends TimeableAction {
    constructor(x, y, time) {
        super(time);
        this.x = x;
        this.y = y;
        this.reset();
    }

    update(container, delta) {
        const pos = container.position;
        const speedX = ((this.x - pos.x) / this.restTime) * delta;
        const speedY = ((this.y - pos.y) / this.restTime) * delta;
        container.x += speedX;
        container.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.x = this.x;
        container.y = this.y;
        super.finish(container);
    }
}
