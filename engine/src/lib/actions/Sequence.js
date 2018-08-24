import Action from './Action';

export default class Sequence extends Action {
    constructor(actions) {
        super();
        this.actions = actions;
        this.reset();
    }

    reset() {
        this._index = 0;
    }

    update(container, delta) {
        if (this._index >= this.actions.length) {
            return true;
        }
        const action = this.actions[this._index];
        const isEnd = action.update(container, delta);
        if (isEnd) {
            action.reset();
            this._index += 1;
        }
        return false;
    }
}
