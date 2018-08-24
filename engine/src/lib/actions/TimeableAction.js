import Action from './Action';

export default class TimeableAction extends Action {
    constructor(time) {
        super();
        this.time = time * 1000;
    }

    reset() {
        this.restTime = this.time;
    }

    update(container, delta) {
        this.restTime -= delta;
        if (this.restTime <= 0) {
            this.finish(container);
            return true;
        }
        return false;
    }
}
