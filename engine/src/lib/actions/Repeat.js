import Action from './Action';

export default class Repeat extends Action {
    constructor(action, count) {
        super();
        this.action = action;
        this.count = count;
        this.reset();
    }

    reset() {
        this._count = this.count;
        if (!this._count) {
            this._count = Infinity;
        }
    }

    update(container, delta) {
        const isEnd = this.action.update(container, delta);
        if (isEnd) {
            this.action.reset();
            this._count -= 1;
        }
        if (this._count <= 0) {
            this.finish(container);
            return true;
        }
        return false;
    }
}
