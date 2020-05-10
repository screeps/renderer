/**
 * Created by vedi on 19/04/2017.
 */

import { resourceTotal } from '../calculation-templates';

const isCooldown = ({ state: { cooldownTime }, stateExtra: { gameTime } }) =>
    cooldownTime && cooldownTime >= gameTime;

export default {
    texture: 'rectangle',
    calculations: [
        resourceTotal(),
        {
            id: 'energyBackgroundHeight',
            func: ({ state: { storeCapacity }, calcs: { resourcesTotal } }) =>
                (resourcesTotal * 50) / (storeCapacity || resourcesTotal),
        },
        {
            id: 'energyHeight',
            func: ({ state: { store = {}, storeCapacity }, calcs: { resourcesTotal } }) =>
                ((store['energy']||0) * 50) / (storeCapacity || resourcesTotal),
        },
        {
            id: 'powerHeight',
            func: ({ state: { store = {}, storeCapacity },
                calcs: { resourcesTotal } }) =>
                (((store['power']||0) + (store['energy']||0)) * 50) / (storeCapacity || resourcesTotal),
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'warp-container-border',
                width: 140,
                height: 140,
                alpha: 0.4,
            },
        },
        {
            type: 'sprite',
            when: isCooldown,
            payload: {
                texture: 'warp-container-border',
                width: 140,
                height: 140,
                alpha: 0,
                blendMode: 1
            },
            actions: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'AlphaTo',
                        params: [1, { $processorParam: 'tickDuration', koef: 0.2 }],
                    },
                    {
                        action: 'AlphaTo',
                        params: [0, { $processorParam: 'tickDuration', koef: 0.8 }],
                    },
                ]],
            }],
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'rectangle-r',
                width: 100,
                height: 100,
                tint: 0x181818,
            },
        },
        {
            type: 'sprite',
            once: true,
            actions: [{
                action: 'Sequence',
                params: [
                    [
                        {
                            action: 'DelayTime',
                            params: [1.4],
                        },
                        {
                            action: 'Repeat',
                            params: [{
                                action: 'Sequence',
                                params: [
                                    [
                                        {
                                            action: 'Spawn',
                                            params: [[
                                                {
                                                    action: 'ScaleTo',
                                                    params: [0, 0, 0],
                                                },
                                                {
                                                    action: 'AlphaTo',
                                                    params: [0.5, 0],
                                                },
                                            ]],
                                        },
                                        {
                                            action: 'ScaleTo',
                                            params: [
                                                {$rel: 'scale.x'},
                                                {$rel: 'scale.y'},
                                                1,
                                            ],
                                        },
                                        {
                                            action: 'DelayTime',
                                            params: [0.5],
                                        },
                                        {
                                            action: 'FadeOut',
                                            params: [0.5],
                                        },

                                    ],
                                ],
                            }],
                        },
                    ],
                ],
            }],
            payload: {
                texture: 'rectangle-r',
                tint: 0xffffff,
                width: 90,
                height: 100,
                alpha: 0,
            },
        },
        {
            type: 'sprite',
            once: true,
            actions: [{
                action: 'Sequence',
                params: [
                    [
                        {
                            action: 'DelayTime',
                            params: [4],
                        },
                        {
                            action: 'Repeat',
                            params: [{
                                action: 'Sequence',
                                params: [
                                    [
                                        {
                                            action: 'Spawn',
                                            params: [[
                                                {
                                                    action: 'ScaleTo',
                                                    params: [0, 0, 0],
                                                },
                                                {
                                                    action: 'AlphaTo',
                                                    params: [1, 0],
                                                },
                                            ]],
                                        },
                                        {
                                            action: 'ScaleTo',
                                            params: [
                                                {$rel: 'scale.x'},
                                                {$rel: 'scale.y'},
                                                1,
                                            ],
                                        },
                                        {
                                            action: 'DelayTime',
                                            params: [0.5],
                                        },
                                        {
                                            action: 'FadeOut',
                                            params: [0.5],
                                        },

                                    ],
                                ],
                            }],
                        },
                    ],
                ],
            }],
            payload: {
                texture: 'rectangle-r',
                tint: 0x61c0ed,
                width: 90,
                height: 100,
                alpha: 0,
            },
        },
        {
            type: 'sprite',
            once: true,
            actions: [{
                action: 'Repeat',
                params: [{
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'Spawn',
                                params: [[
                                    {
                                        action: 'ScaleTo',
                                        params: [0, 0, 0],
                                    },
                                    {
                                        action: 'AlphaTo',
                                        params: [1, 0],
                                    },
                                ]],
                            },
                            {
                                action: 'ScaleTo',
                                params: [
                                    { $rel: 'scale.x' },
                                    { $rel: 'scale.y' },
                                    1,
                                ],
                            },
                            {
                                action: 'FadeOut',
                                params: [1],
                            },
                        ],
                    ],
                }],
            }],
            payload: {
                texture: 'rectangle-r',
                width: 90,
                height: 100,
                tint: 0x5555AA,
            },
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                width: 140,
                height: 140,
                texture: 'warp-container',
            },
        },
        {
            type: 'sprite',
            id: 'otherResourcesBar',
            props: ['store', 'energyBackgroundHeight', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} }, calcs: { resourcesTotal } }) =>
                store['energy']||0 + store['power']||0 < resourcesTotal,
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
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} } }) => store['power'] > 0,
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
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} } }) => store['energy'] > 0,
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
                width: 200,
                height: 200,
                alpha: 1,
            },
        },
    ],
    zIndex: 4,
};
