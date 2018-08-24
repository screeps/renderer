/**
 * Created by vedi on 19/03/2017.
 */

import { CallFunc, FadeOut, Sequence } from '../actions';

export default ({ stage, rootContainer, tickDuration, callback }) => {
    const { actionManager } = stage;
    const action = new Sequence([
        new FadeOut(tickDuration / 2),
        new CallFunc(() => {
            callback();
        }),
    ]);
    // TODO: Cancel all previous actions
    actionManager.runAction(rootContainer, action);
};
