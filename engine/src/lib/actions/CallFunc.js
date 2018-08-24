import TimeableAction from './TimeableAction';

export default class CallFunc extends TimeableAction {
    constructor(func, time = 0) {
        super(time);
        this.func = func || (() => {
        });
        this.reset();
    }

    update(container, delta) {
        this.func(container, this.restTime, delta);
        return super.update(container, delta);
    }
}
