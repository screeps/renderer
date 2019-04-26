/**
 * Created by vedi on 19/04/2017.
 */

import { resourceTotal } from '../calculation-templates';
import constants from '@screeps/common/lib/constants';

const WEIGHT = 110;
const TOTAL_HEIGHT = 140;

export default {
    texture: 'storage',
    calculations: [
        resourceTotal(),
        {
            id: 'energyBackgroundHeight',
            func: ({ calcs: { resourcesTotal }, state: { storeCapacity } }) => {
                return (resourcesTotal * TOTAL_HEIGHT) / Math.max(storeCapacity||constants.STORAGE_CAPACITY, resourcesTotal);
            },
        },
        {
            id: 'energyHeight',
            func: ({ calcs: { resourcesTotal }, state: { store, storeCapacity } }) => {
                return (store['energy'] * TOTAL_HEIGHT) / Math.max(storeCapacity||constants.STORAGE_CAPACITY, resourcesTotal);
            },
        },
        {
            id: 'powerHeight',
            func: ({ calcs: { resourcesTotal }, state: { store, storeCapacity } }) => {
                return (((store['power']||0) + (store['energy']||0)) * TOTAL_HEIGHT) / Math.max((storeCapacity||constants.STORAGE_CAPACITY), resourcesTotal);
            },
        },
    ],
    processors: [
        {
            id: 'border',
            type: 'sprite',
            once: true,
            payload: {
                texture: 'storage-border',
                width: 200,
                height: 200,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'storage',
                width: 200,
                height: 200,
            },
        },
        {
            id: 'otherResourcesBar',
            type: 'sprite',
            props: ['store', 'energyBackgroundHeight', 'resourcesTotal'],
            shouldRun: ({ state: { store }, calcs: { resourcesTotal } }) =>
                store['energy'] + (store['power'] || 0) < resourcesTotal,
            payload: {
                texture: 'rectangle',
                pivot: {
                    y: { $calc: 'energyBackgroundHeight' },
                },
                y: TOTAL_HEIGHT / 2,
                width: WEIGHT,
                height: { $calc: 'energyBackgroundHeight' },
                tint: 0xffffff,
            },
        },
        {
            id: 'powerBar',
            type: 'sprite',
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store } }) => store['power'] > 0,
            payload: {
                texture: 'rectangle',
                pivot: {
                    y: { $calc: 'powerHeight' },
                },
                y: TOTAL_HEIGHT / 2,
                width: WEIGHT,
                height: { $calc: 'powerHeight' },
                tint: 0xf41f33,
            },
        },
        {
            type: 'sprite',
            id: 'energyBar',
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store } }) => store['energy'] > 0,
            payload: {
                texture: 'rectangle',
                pivot: {
                    y: { $calc: 'energyHeight' },
                },
                y: TOTAL_HEIGHT / 2,
                width: WEIGHT,
                height: { $calc: 'energyHeight' },
                tint: 0xffe56d,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: ({ calcs: { resourcesTotal } }) => resourcesTotal > 0,
            payload: {
                texture: 'glow',
                width: 200,
                height: 200,
                alpha: 1,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                alpha: 0.5,
            },
        },
    ],
    zIndex: 7,
};
