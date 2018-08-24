/**
 * Created by vedi on 19/03/2017.
 */

import circle from './circle';
import sprite from './sprite';

const CIRCLE_PAYLOAD = {
    radius: 37,
    color: 0x222222,
};

const BADGE_PAYLOAD = {
    texture: null,
};

export default (params) => {
    const {
        payload: {
            parentId,
            radius = CIRCLE_PAYLOAD.radius,
            color = CIRCLE_PAYLOAD.color,
            ...restPayload
        } = {},
        scope,
        scope: { [parentId]: parent },
        state: { user },
        stateExtra: { users = {} },
        state,
        stateExtra,
        ...otherParams
    } = params;

    const userBadgeUrl = user && users[user] && users[user].badgeUrl;
    if (userBadgeUrl) {
        const spritePayload = {
            ...BADGE_PAYLOAD,
            width: 2 * radius,
            texture: userBadgeUrl,
            parentId,
            ...restPayload,
        };
        const scope = { [parentId]: parent };
        return sprite({ payload: spritePayload, scope, ...otherParams });
    } else {
        return circle({ payload: { radius, color, parentId }, scope, ...otherParams });
    }
};
