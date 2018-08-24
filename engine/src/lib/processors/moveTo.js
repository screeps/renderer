/**
 * Created by vedi on 19/03/2017.
 */

import { calculateAngle, convertGameXYToWorld } from '../../../../helpers/mathHelper';
import { RotateTo, Spawn } from '../actions';

/**
 * @param params
 */
export default ({
    firstRun,
    state,
    payload: { targetKey, shouldRotate = false } = {},
    rootContainer,
    stage,
    prevState,
    scope,
    tickDuration,
    world: {
        options: worldOptions,
    },
}) => {
    const { actionManager } = stage;
    const { x, y } = convertGameXYToWorld(state, worldOptions);

    const targetObject = targetKey ? scope[targetKey] : rootContainer;
    if (!firstRun) {
        const actions = [];

        // it's not initial state as we do not want to rotate it at initial phase
        if (prevState && shouldRotate) {
            actions.push(new RotateTo(
                calculateAngle(targetObject.x, targetObject.y, x, y), tickDuration / 5));
        }

        const action = new Spawn(actions);
        if (scope.moveToAction) {
            actionManager.cancelAction(scope.moveToAction);
        }
        scope.moveToAction = actionManager.runAction(targetObject, action);
    }
};
