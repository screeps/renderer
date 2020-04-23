import {resourceTotal} from "../calculation-templates";
import constants from '@screeps/common/lib/constants';

/**
 * Created by vedi on 29/08/2017.
 */

export default {
    calculations: [
        resourceTotal(),
        {
            id: 'energyScale',
            props: ['store', 'storeCapacity'],
            func: ({ state: { store, storeCapacity } }) =>
                Math.min(1, (store.energy||0) / (storeCapacity||constants.LINK_CAPACITY))
        },
        {
            id: 'powerScale',
            props: ['store', 'storeCapacity'],
            func: ({ state: { store, storeCapacity } }) =>
                Math.min(1, ((store.power||0) + (store.energy||0)) / (storeCapacity||constants.LINK_CAPACITY))
        },
        {
            id: 'mineralScale',
            props: ['store', 'storeCapacity', 'resourcesTotal'],
            func: ({ state: { store, storeCapacity }, calcs: { resourcesTotal } }) =>
                Math.min(1, resourcesTotal / (storeCapacity||constants.LINK_CAPACITY))
        }
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
                id: 'mineralContainer',
            },
        },
        {
            type: 'container',
            once: 'true',
            payload: {
                id: 'powerContainer',
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
                id: 'mineral',
                parentId: 'mineralContainer',
                texture: 'link-mineral',
                width: 50,
                height: 50,
            },
        },
        {
            type: 'sprite',
            once: 'true',
            payload: {
                id: 'power',
                parentId: 'powerContainer',
                texture: 'link-power',
                width: 50,
                height: 50,
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
            props: ['mineralScale'],
            payload: {
                id: 'mineralContainer',
            },
            actions: [
                {
                    action: 'ScaleTo',
                    params: [
                        { $calc: 'mineralScale' },
                        { $calc: 'mineralScale' },
                        { $processorParam: 'tickDuration' },
                    ],
                },
            ],
        },
        {
            type: 'runAction',
            props: ['powerScale'],
            payload: {
                id: 'powerContainer',
            },
            actions: [
                {
                    action: 'ScaleTo',
                    params: [
                        { $calc: 'powerScale' },
                        { $calc: 'powerScale' },
                        { $processorParam: 'tickDuration' },
                    ],
                },
            ],
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
            shouldRun: ({ calcs: { resourcesTotal } }) => resourcesTotal > 0,
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
            shouldRun: ({ calcs: { resourcesTotal } }) => resourcesTotal > 0,
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
