import TimeableAction from './TimeableAction';

export default class SkewBy extends TimeableAction {
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
        const { skew } = container;
        if (this.tx === null || this.ty === null) {
            this.tx = skew.x + this.x;
            this.ty = skew.y + this.y;
        }
        const speedX = ((this.tx - skew.x) / this.restTime) * delta;
        const speedY = ((this.ty - skew.y) / this.restTime) * delta;
        container.skew.x += speedX;
        container.skew.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.skew.x = this.tx;
        container.skew.y = this.ty;
        super.finish(container);
    }
}
