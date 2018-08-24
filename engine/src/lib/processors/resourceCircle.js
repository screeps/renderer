/**
 * Created by vedi on 19/03/2017.
 */

import circle from './circle';
import actionHelper from '../utils/actionHelper';

const METADATA = {
    creepEnergy: {
        color: 0xffe56d,
        radius: 20,
    },
    energy: {
        color: 0xffe56d,
        radius: 30,
    },
    power: {
        color: 0xf41f33,
        radius: 45,
    },
};

const DEFAULT_METADATA = {
    color: 0xFFFFFF,
    radius: 45,
};

export default (params) => {
    const {
        state: {
            resourceType: resourceMetaName = 'creepEnergy',
            resourceType = 'energy',
            [resourceType]: newResource,
            [`${resourceType}Capacity`]: capacity = 1250.0,
        } = {},
        prevState: { [resourceType]: resource } = {},
        payload: {
            radius: payloadRadius,
        } = {},
        ...otherParams
    } = params;

    if (resource !== newResource) {
        const {
            [resourceMetaName]: { color, radius: metadataRadius } = DEFAULT_METADATA,
        } = METADATA;
        const parsedPayloadRadius = actionHelper.parseExpression(payloadRadius, params);
        const radius = (parsedPayloadRadius || metadataRadius) *
            Math.min(1, (capacity !== 0 ? newResource / capacity : 0));
        return circle({
            payload: {
                color,
                radius,
            },
            ...otherParams,
        });
    }
};
