import Action from './Action';
import {
    linear,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInQuart,
    easeOutQuart,
    easeInOutQuart,
    easeInQuint,
    easeOutQuint,
    easeInOutQuint,
} from './easingHelper';

class Ease extends Action {
    constructor(action, easeType = easeOutQuad) {
        super();
        this.time = action.time;
        this.action = action;
        if (typeof easeType !== 'string') {
            this.easeType = easeType;
        } else {
            this.easeType = Ease.TYPE[easeType];
            if (!this.easeType) {
                throw new Error(`Wrong easeType ${easeType}`);
            }
        }
        this.reset();
    }

    reset() {
        this.originialTimePassed = 0;
        this.timePassed = 0;
        this.action.reset();
        super.reset();
    }

    update(container, delta) {
        this.originialTimePassed += delta;
        const easeDelta = this.originialTimePassed <= this.time ?
            Math.max(
                (this.time * this.easeType(this.originialTimePassed / this.time)) - this.timePassed,
                0
            ) : delta;
        this.timePassed += easeDelta;
        const result = this.action.update(container, easeDelta);
        if (result) {
            this.finish(container);
        }
        return result;
    }

    finish(container) {
        this.action.finish(container);
        super.finish(container);
    }
}

Ease.TYPE = {
    LINEAR: linear,
    EASE_IN_QUAD: easeInQuad,
    EASE_OUT_QUAD: easeOutQuad,
    EASE_IN_OUT_QUAD: easeInOutQuad,
    EASE_IN_CUBIC: easeInCubic,
    EASE_OUT_CUBIC: easeOutCubic,
    EASE_IN_OUT_CUBIC: easeInOutCubic,
    EASE_IN_QUART: easeInQuart,
    EASE_OUT_QUART: easeOutQuart,
    EASE_IN_OUT_QUART: easeInOutQuart,
    EASE_IN_QUINT: easeInQuint,
    EASE_OUT_QUINT: easeOutQuint,
    EASE_IN_OUT_QUINT: easeInOutQuint,
};

export default Ease;
