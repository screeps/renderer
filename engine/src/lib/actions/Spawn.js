import Action from './Action';

/**
 * Spawn is very similar to Sequence, except that all actions will run at the same time.
 */
export default class Spawn extends Action {
    constructor(actions) {
        super();
        this.actions = actions;
        this.reset();
    }

    reset() {
        this.actionsToRun = [...this.actions];
    }

    update(container, delta) {
        this.actionsToRun = this.actionsToRun.filter((action) => {
            const isEnd = action.update(container, delta);
            if (isEnd) {
                action.reset();
                return false;
            } else {
                return true;
            }
        });
        if (this.actionsToRun.length === 0) {
            this.finish(container);
            return true;
        }
        return false;
    }
}
