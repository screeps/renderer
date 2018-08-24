/**
 * Created by vedi on 19/04/2017.
 */

import { resourceTotal } from '../calculation-templates';

export default {
    texture: 'rectangle',
    calculations: [
        resourceTotal(),
        {
            id: 'energyBackgroundHeight',
            func: ({ state: { energyCapacity }, calcs: { resourcesTotal } }) =>
                (resourcesTotal * 50) / (energyCapacity || resourcesTotal),
        },
        {
            id: 'energyHeight',
            func: ({ state: { energy = 0, energyCapacity }, calcs: { resourcesTotal } }) =>
                (energy * 50) / (energyCapacity || resourcesTotal),
        },
        {
            id: 'powerHeight',
            func: ({ state: { energy = 0, energyCapacity, power = 0 },
                calcs: { resourcesTotal } }) =>
                ((power + energy) * 50) / (energyCapacity || resourcesTotal),
        },
    ],
    processors: [
        {
            type: 'sprite',
            id: 'border',
            once: true,
            payload: {
                width: 60,
                height: 70,
                tint: 0x181818,
            },
        },
        {
            id: 'internalBorder',
            type: 'sprite',
            once: true,
            payload: {
                width: 40,
                height: 50,
                tint: 0x5555555,
            },
        },
        {
            type: 'sprite',
            id: 'otherResourcesBar',
            props: ['energy', 'power', 'energyBackgroundHeight', 'resourcesTotal'],
            shouldRun: ({ state: { power = 0, energy = 0 }, calcs: { resourcesTotal } }) =>
                energy + power < resourcesTotal,
            payload: {
                pivot: {
                    y: { $calc: 'energyBackgroundHeight' },
                },
                y: 25,
                width: 40,
                height: { $calc: 'energyBackgroundHeight' },
                tint: 0xffffff,
            },
        },
        {
            type: 'sprite',
            id: 'powerBar',
            props: ['energy', 'power', 'resourcesTotal'],
            shouldRun: ({ state: { power = 0 } }) => power > 0,
            payload: {
                pivot: {
                    y: { $calc: 'powerHeight' },
                },
                y: 25,
                width: 40,
                height: { $calc: 'powerHeight' },
                tint: 0xf41f33,
            },
        },
        {
            type: 'sprite',
            id: 'energyBar',
            props: ['energy', 'power', 'resourcesTotal'],
            shouldRun: ({ state: { energy = 0 } }) => energy > 0,
            payload: {
                pivot: {
                    y: { $calc: 'energyHeight' },
                },
                y: 25,
                width: 40,
                height: { $calc: 'energyHeight' },
                tint: 0xffe56d,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            props: ['resourcesTotal'],
            shouldRun: ({ calcs: { resourcesTotal } }) => resourcesTotal > 0,
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
    ],
    zIndex: 4,
};
