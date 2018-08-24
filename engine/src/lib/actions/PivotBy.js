import TimeableAction from './TimeableAction';

export default class PivotBy extends TimeableAction {
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

    // if end return true, if not end return false
    update(container, delta) {
        const { pivot } = container;
        if (this.tx === null || this.ty === null) {
            this.tx = pivot.x + this.x;
            this.ty = pivot.y + this.y;
        }
        const speedX = ((this.tx - pivot.x) / this.restTime) * delta;
        const speedY = ((this.ty - pivot.y) / this.restTime) * delta;
        container.pivot.x += speedX;
        container.pivot.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.pivot.x = this.tx;
        container.pivot.y = this.ty;
        super.finish(container);
    }
}
