/**
 * Created by vedi on 23/04/2017.
 */

const METADATA = {
    small: 68,
    medium: 80,
    large: 100,
};

export default {
    calculations: [
        {
            id: 'size',
            props: ['storeCapacityResource'],
            func: ({ state: { storeCapacityResource } }) => {
                if (storeCapacityResource && storeCapacityResource.energy >= 200) {
                    return METADATA.large;
                } else if (storeCapacityResource && storeCapacityResource.energy >= 100) {
                    return METADATA.medium;
                } else {
                    return METADATA.small;
                }
            },
        },
        {
            id: 'resourceScale',
            props: ['store', 'storeCapacityResource'],
            func: ({ state: { store, storeCapacityResource } }) =>
                storeCapacityResource ? Math.min(1, (store.energy||0) / storeCapacityResource.energy) : 0,
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: true,
            when: ({ state: { storeCapacityResource } }) => !storeCapacityResource || storeCapacityResource.energy < 100,
            payload: {
                texture: 'extension-border50',
                tint: { $calc: 'playerColor' },
                width: 100,
                height: 100,
            },
        },
        {
            type: 'sprite',
            once: true,
            when: ({ state: { storeCapacityResource } }) => storeCapacityResource && storeCapacityResource.energy === 100,
            payload: {
                texture: 'extension-border100',
                tint: { $calc: 'playerColor' },
                width: 100,
                height: 100,
            },
        },
        {
            type: 'sprite',
            once: true,
            when: ({ state: { storeCapacityResource } }) => storeCapacityResource && storeCapacityResource.energy === 200,
            payload: {
                texture: 'extension-border200',
                tint: { $calc: 'playerColor' },
                width: 100,
                height: 100,
            },
        },

        {
            type: 'sprite',
            props: ['storeCapacityResource'],
            payload: {
                texture: 'extension',
                width: { $calc: 'size' },
                height: { $calc: 'size' },
            },
        },
        {
            id: 'resourceCircle',
            props: ['storeCapacityResource'],
            type: 'circle',
            payload: {
                radius: { $calc: 'size', koef: 0.32 },
                color: 0xffe56d,
                scale: {
                    x: { $calc: 'resourceScale' },
                    y: { $calc: 'resourceScale' },
                },
            },
        },
        {
            type: 'runAction',
            props: ['resourceScale'],
            payload: {
                id: 'resourceCircle',
            },
            actions: [
                {
                    action: 'ScaleTo',
                    params: [
                        { $calc: 'resourceScale' },
                        { $calc: 'resourceScale' },
                        { $processorParam: 'tickDuration' },
                    ],
                },
            ],
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { store } }) => store && store.energy > 0),
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { store, storeCapacityResource } }) => (store.energy||0) > 0 &&
                storeCapacityResource && storeCapacityResource.energy === 50),
            payload: {
                texture: 'glow',
                width: 200,
                height: 200,
                alpha: 0.7,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { store, storeCapacityResource } }) => (store.energy||0) > 0 &&
                storeCapacityResource && storeCapacityResource.energy === 100),
            payload: {
                texture: 'glow',
                width: 220,
                height: 220,
                alpha: 0.7,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { store, storeCapacityResource } }) => (store.energy||0) > 0 &&
                storeCapacityResource && storeCapacityResource.energy === 200),
            payload: {
                texture: 'glow',
                width: 250,
                height: 250,
                alpha: 0.7,
            },
        },
    ],
    zIndex: 7,
};
