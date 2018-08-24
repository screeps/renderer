import * as PIXI from 'pixi.js';

export default class ActionHandle extends PIXI.utils.EventEmitter {
    constructor(container, action) {
        super();
        this._id = `_${PIXI.utils.uid()}`;
        this.container = container;
        this.action = action;

        this._started = false;
        this._ended = false;
        this._active = false;
    }

    update(delta) {
        if (!this._started) {
            // start event
            this.emit('start', delta);
            this._started = true;
            this._active = true;
        }

        // do some update
        try {
            this._ended = this.action.update(this.container, delta);
        } catch (error) {
            console.error('Exception while animation:', error);
            this._ended = true;
        }

        if (this._ended && this._active) {
            // end event
            this.emit('end', delta);
            this._active = false;
        }
    }

    isEnded() {
        return this._ended;
    }
}
