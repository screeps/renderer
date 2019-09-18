/**
 * Created by vedi on 23/04/2017.
 */

import { resourceTotal } from '../calculation-templates';

export default {
    calculations: [
        resourceTotal(),
        {
            id: 'resourceColor',
            func: ({ calcs: { resourcesTotal, playerColor } }) =>
                (resourcesTotal > 0 ? playerColor : 0x000000),
        },
        {
            id: 'decayAlpha',
            func: ({ state: { decayTime, destroyTime }, stateExtra: { gameTime } }) =>
                1 - ((gameTime - destroyTime) / (decayTime - destroyTime)),
        },
    ],
    processors: [
        {
            type: 'sprite',
            id: 'ruin',
            once: true,
            payload: {
                texture: 'ruin',
                width: 100,
                height: 100,
                blendMode: 1,
                alpha: { $calc: 'decayAlpha' },
            },
        },
        {
            type: 'sprite',
            props: ['resourceColor'],
            payload: {
                texture: 'tombstone-resource',
                tint: { $calc: 'resourceColor' },
                alpha: 0.8,
                width: 100,
                height: 100,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'tombstone-resource',
                width: 100,
                height: 100,
            },
        },
    ],
    actions: [
        {
            targetId: 'ruin',
            actions: [
                {
                    action: 'AlphaTo',
                    params: [
                        { $calc: 'decayAlpha' },
                        0,
                    ],
                },
            ],
        },
    ],
    zIndex: 5,
};
