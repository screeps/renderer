import TimeableAction from './TimeableAction';

export default class ScaleBy extends TimeableAction {
    constructor(scaleX, scaleY, time) {
        super(time);
        this.x = scaleX;
        this.y = scaleY;
        this.reset();
    }

    reset() {
        super.reset();
        this.tx = null; // target scale x
        this.ty = null; // target scale y
    }

    update(container, delta) {
        const { scale } = container;
        if (this.tx === null || this.ty === null) {
            this.tx = scale.x + this.x;
            this.ty = scale.y + this.y;
        }
        const speedX = ((this.tx - scale.x) / this.restTime) * delta;
        const speedY = ((this.ty - scale.y) / this.restTime) * delta;
        container.scale.x += speedX;
        container.scale.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.scale.x = this.tx;
        container.scale.y = this.ty;
        super.finish(container);
    }
}
