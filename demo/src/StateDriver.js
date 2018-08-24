import _ from 'lodash';

export default class StateDriver {
    constructor(initialState = { }) {
        this.state = { ...initialState };
        if (!this.state.actionLog) {
            this.state.actionLog = {};
        }
    }

    say(sayState = null) {
        this.setActionLog({ say: sayState });
        return this;
    }

    moveBy(dx, dy) {
        Object.assign(this.state, { x: this.state.x + dx, y: this.state.y + dy });
        return this;
    }

    setActionLog(actionLogStateChanges) {
        this.state.actionLog = { ...(this.state.actionLog || {}), ...actionLogStateChanges };
        return this;
    }

    createState(stateChanges) {
        return { ...this.state, ...stateChanges };
    }

    getState(...props) {
        return _.pick(this.state, ...props);
    }
}
