import TimeableAction from './TimeableAction';

export default class ScaleTo extends TimeableAction {
    constructor(scaleX, scaleY, time) {
        super(time);
        this.x = scaleX;
        this.y = scaleY;
        this.reset();
    }

    update(container, delta) {
        const { scale } = container;
        const speedX = ((this.x - scale.x) / this.restTime) * delta;
        const speedY = ((this.y - scale.y) / this.restTime) * delta;
        container.scale.x += speedX;
        container.scale.y += speedY;
        return super.update(container, delta);
    }

    finish(container) {
        container.scale.x = this.x;
        container.scale.y = this.y;
        super.finish(container);
    }
}
