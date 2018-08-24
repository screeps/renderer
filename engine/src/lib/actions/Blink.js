import TimeableAction from './TimeableAction';

export default class Blink extends TimeableAction {
    constructor(count, time) {
        super(time);
        this.count = count;
        this.reset();
    }

    reset() {
        this._count = this.count * 2;
        this._gap = this.time / this._count; // 每次的时间
        super.reset();
    }

    // if end return true, if not end return false
    update(container, delta) {
        if (this.restTime <= 0) {
            // toggle
            container.visible = !container.visible;
            this.restTime = this._gap;
            this._count -= 1;
        } else {
            this.restTime -= delta;
        }
        // return true / false: ended / not end
        if (this._count <= 0) {
            this.finish(container);
            return true;
        }
        return false;
    }
}
