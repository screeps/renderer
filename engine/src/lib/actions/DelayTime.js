import TimeableAction from './TimeableAction';

export default class DelayTime extends TimeableAction {
    constructor(time) {
        super(time);
        this.reset();
    }
}
