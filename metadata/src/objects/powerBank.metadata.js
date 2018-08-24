/**
 * Created by vedi on 23/04/2017.
 */

import constants from '@screeps/common/lib/constants';

const ellipse = {
    color: 0xf41f33,
    strokeColor: 0x8d000d,
    strokeWidth: 10,
};

export default {
    calculations: [
        {
            id: 'radius',
            props: ['power'],
            func: ({ state: { power } }) => {
                const { POWER_BANK_CAPACITY_MAX } = constants;
                return Math.sqrt(((power / POWER_BANK_CAPACITY_MAX) * 3000) / Math.PI);
            },
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'powerBank',
                width: 200,
                height: 200,
            },
        },
        {
            type: 'draw',
            once: true,
            payload: {
                id: 'static',
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            ellipse.strokeWidth,
                            ellipse.strokeColor,
                            1,
                        ],
                    },
                    { method: 'beginFill', params: [ellipse.color] },
                    {
                        method: 'drawCircle',
                        params: [
                            0,
                            0,
                            { $calc: 'radius' },
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
            actions: [
                {
                    action: 'Repeat',
                    params: [
                        {
                            action: 'Spawn',
                            params: [[
                                {
                                    action: 'Sequence',
                                    params: [[
                                        {
                                            action: 'ScaleTo',
                                            params: [
                                                { $rel: 'scale.x', koef: 0.6 },
                                                { $rel: 'scale.y', koef: 0.6 },
                                                { $processorParam: 'tickDuration', koef: 0.66 },
                                            ],
                                        },
                                        {
                                            action: 'ScaleTo',
                                            params: [
                                                { $rel: 'scale.x' },
                                                { $rel: 'scale.y' },
                                                { $processorParam: 'tickDuration', koef: 0.34 },
                                            ],
                                        },
                                    ]],
                                },
                                {
                                    action: 'Sequence',
                                    params: [[
                                        {
                                            action: 'TintTo',
                                            params: [
                                                0xd31022,
                                                { $processorParam: 'tickDuration', koef: 0.33 },
                                            ],
                                        },
                                        {
                                            action: 'TintTo',
                                            params: [
                                                0x8d000d,
                                                { $processorParam: 'tickDuration', koef: 0.33 },
                                            ],
                                        },
                                        {
                                            action: 'TintTo',
                                            params: [
                                                0xf41f33,
                                                { $processorParam: 'tickDuration', koef: 0.34 },
                                            ],
                                        },
                                    ]],
                                },
                            ]],
                        },
                    ],
                },
            ],
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                tint: 0xFF8080,
            },
        },
    ],
    zIndex: 11,
};
