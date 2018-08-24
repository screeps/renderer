/**
 * Created by vedi on 19/04/2017.
 */

import constants from '@screeps/common/lib/constants';

import { resourceTotal } from '../calculation-templates';

const WEIGHT = 110;
const TOTAL_HEIGHT = 140;

export default {
    texture: 'storage',
    calculations: [
        resourceTotal(),
        {
            id: 'energyBackgroundHeight',
            func: ({ calcs: { resourcesTotal } }) => {
                const { STORAGE_CAPACITY } = constants;
                return (resourcesTotal * TOTAL_HEIGHT) / STORAGE_CAPACITY;
            },
        },
        {
            id: 'energyHeight',
            func: ({ state: { energy } }) => {
                const { STORAGE_CAPACITY } = constants;
                return (energy * TOTAL_HEIGHT) / STORAGE_CAPACITY;
            },
        },
        {
            id: 'powerHeight',
            func: ({ state: { energy, power = 0 } }) => {
                const { STORAGE_CAPACITY } = constants;
                return ((power + energy) * TOTAL_HEIGHT) / STORAGE_CAPACITY;
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
            props: ['energy', 'power', 'energyBackgroundHeight', 'resourcesTotal'],
            shouldRun: ({ state: { power, energy }, calcs: { resourcesTotal } }) =>
                energy + (power || 0) < resourcesTotal,
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
            props: ['energy', 'power', 'resourcesTotal'],
            shouldRun: ({ state: { power } }) => power > 0,
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
            props: ['energy', 'power', 'resourcesTotal'],
            shouldRun: ({ state: { energy } }) => energy > 0,
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
