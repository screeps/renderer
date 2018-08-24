import TimeableAction from './TimeableAction';

export default class MoveBy extends TimeableAction {
    constructor(x, y, time) {
        super(time);
        this.x = x;
        this.y = y;
        this.reset();
    }

    reset() {
        super.reset();
        this.tx = null; // target x
        this.ty = null; // target y
    }

    update(container, delta) {
        const pos = container.position;
        if (this.tx === null || this.ty === null) {
            this.tx = pos.x + this.x;
            this.ty = pos.y + this.y;
        }
        const speedX = ((this.tx - pos.x) / this.restTime) * delta;
        const speedY = ((this.ty - pos.y) / this.restTime) * delta;
        container.x += speedX;
        container.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.x = this.tx;
        container.y = this.ty;
        super.finish(container);
    }
}
