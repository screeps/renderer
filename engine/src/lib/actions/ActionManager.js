import ActionHandle from './ActionHandle';

export default class ActionManager {
    constructor() {
        this.actions = {}; // the actions need to be done.
        this._actionsToDelete = [];

        this._last = 0;
    }

    update(delta) {
        this._removeActions();
        let deltaMs;
        // calculate deltaMs
        if (!delta && delta !== 0) {
            deltaMs = this._getDeltaMs();
        } else {
            deltaMs = delta * 1000;
        }
        Object.values(this.actions).forEach(({ actionHandle }) => {
            actionHandle.update(deltaMs);
            // if action is end, remove it.
            if (actionHandle.isEnded()) {
                this._actionsToDelete.push(actionHandle);
            }
        });
        this._removeActions();
    }

    // run action
    runAction(container, action) {
        // add into actions to be done.
        const actionHandle = new ActionHandle(container, action);
        this.actions[actionHandle._id] = { actionHandle, container };
        return actionHandle;
    }

    // cancel action
    cancelAction(actionHandle) {
        this._actionsToDelete.push(actionHandle);
    }

    // finish action
    finishAction(actionHandle) {
        if (this.actions[actionHandle._id] && !this._actionsToDelete.includes(actionHandle)) {
            actionHandle.action.finish(actionHandle.container);
            this._actionsToDelete.push(actionHandle);
        }
    }

    // cancel action for container
    cancelActionForContainer(container) {
        Object.values(this.actions).forEach(({ actionHandle, container: actionSprite }) => {
            if (container === actionSprite) {
                this._actionsToDelete.push(actionHandle);
            }
        });
    }

    _remove(actionHandle) {
        delete (this.actions[actionHandle._id]);
    }

    _removeActions() {
        if (this._actionsToDelete.length) {
            for (let i = 0; i < this._actionsToDelete.length; i += 1) {
                this._remove(this._actionsToDelete[i]);
            }
            this._actionsToDelete.length = 0;
        }
    }
    _getDeltaMs() {
        if (this._last === 0) this._last = Date.now();
        const now = Date.now();
        const deltaMS = now - this._last;
        this._last = now;
        return deltaMS;
    }
}
