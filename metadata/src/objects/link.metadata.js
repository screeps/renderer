/**
 * Created by vedi on 29/08/2017.
 */

export default {
    calculations: [
        {
            id: 'energyScale',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy, energyCapacity } }) =>
                Math.min(1, energy / energyCapacity),
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'link-border',
                width: 100,
                height: 100,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'link',
                width: 100,
                height: 100,
            },
        },
        {
            type: 'container',
            once: 'true',
            payload: {
                id: 'energyContainer',
            },
        },
        {
            type: 'sprite',
            once: 'true',
            payload: {
                id: 'energy',
                parentId: 'energyContainer',
                texture: 'link-energy',
                width: 50,
                height: 50,
            },
        },
        {
            type: 'runAction',
            props: ['energyScale'],
            payload: {
                id: 'energyContainer',
            },
            actions: [
                {
                    action: 'ScaleTo',
                    params: [
                        { $calc: 'energyScale' },
                        { $calc: 'energyScale' },
                        { $processorParam: 'tickDuration' },
                    ],
                },
            ],
        },
        {
            type: 'creepActions',
            props: '*',
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { energy } }) => energy > 0),
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
        {
            id: 'light',
            once: true,
            type: 'sprite',
            layer: 'lighting',
            shouldRun: (({ state: { energy } }) => energy > 0),
            payload: {
                texture: 'glow',
                width: 400,
                height: 400,
                alpha: 0.5,
            },
        },

    ],
    zIndex: 9,
};
