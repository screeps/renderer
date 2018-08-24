import TimeableAction from './TimeableAction';

export default class FilterTo extends TimeableAction {
    constructor(filterIdx, propName, propValue, time) {
        super(time);
        this.filterIdx = filterIdx;
        this.propName = propName;
        this.propValue = propValue;
        this.reset();
    }

    // if end return true, if not end return false
    update(container, delta) {
        const value = container.filters[this.filterIdx][this.propName];
        container.filters[this.filterIdx][this.propName] +=
            ((this.propValue - value) / this.restTime) * delta;
        return super.update(container, delta);
    }

    finish(container) {
        container.filters[this.filterIdx][this.propName] = this.propValue;
        super.finish(container);
    }
}
