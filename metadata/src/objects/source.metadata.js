/**
 * Created by vedi on 23/04/2017.
 */

import { flickering } from '../action-templates';

const rect1 = {
    animationDuration: 4.0,
    fillColor: 0x111111,
    radius: 15,
    size: 40,
    strokeBlinkingColor: 0x0e0c04,
    strokeColor: 0x595026,
    strokeWidth: 15,
};

const rect2 = {
    animationDuration: 2,
    fillColor: 0xffe56d,
    radius: 15,
    size: 60,
    blinkingColors: [0xffffff, 0xffcd6d, 0xffde84],
};

export default {
    calculations: [
        {
            id: 'energySize',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy, energyCapacity } }) =>
                (rect2.size * energy) / energyCapacity,
        },
    ],
    processors: [
        {
            type: 'draw',
            once: true,
            payload: {
                id: 'static',
                tint: rect1.strokeColor,
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            rect1.strokeWidth,
                            0xffffff,
                            1,
                        ],
                    },
                    { method: 'beginFill', params: [rect1.fillColor] },
                    {
                        method: 'drawRoundedRect',
                        params: [
                            -rect1.size / 2,
                            -rect1.size / 2,
                            rect1.size,
                            rect1.size,
                            rect1.radius,
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
            actions: [{
                action: 'Repeat',
                params: [{
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'TintTo',
                                params: [
                                    rect1.strokeBlinkingColor,
                                    rect1.animationDuration / 2,
                                ],
                            },
                            {
                                action: 'TintTo',
                                params: [
                                    rect1.strokeColor,
                                    rect1.animationDuration / 2,
                                ],
                            },
                        ],
                    ],
                }],
            }],
        },
        {
            type: 'draw',
            props: ['energySize'],
            payload: {
                id: 'energy',
                tint: rect2.fillColor,
                drawings: [
                    { method: 'beginFill', params: [0xffffff] },
                    {
                        method: 'drawRoundedRect',
                        params: [
                            { $calc: 'energySize', koef: -0.5 },
                            { $calc: 'energySize', koef: -0.5 },
                            { $calc: 'energySize' },
                            { $calc: 'energySize' },
                            rect1.radius,
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
            actions: [{
                action: 'Repeat',
                params: [{
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'TintTo',
                                params: [
                                    rect2.blinkingColors[0],
                                    rect2.animationDuration / 4,
                                ],
                            },
                            {
                                action: 'TintTo',
                                params: [
                                    rect2.blinkingColors[1],
                                    rect2.animationDuration / 4,
                                ],
                            },
                            {
                                action: 'TintTo',
                                params: [
                                    rect2.blinkingColors[2],
                                    rect2.animationDuration / 4,
                                ],
                            },
                            {
                                action: 'TintTo',
                                params: [
                                    rect2.fillColor,
                                    rect2.animationDuration / 4,
                                ],
                            },
                        ],
                    ],
                }],
            }],
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                tint: 0xFFFF50,
                alpha: 0.5,
            },
            actions: [flickering(0.6, 0.4, 0.8, 0.4)],
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            shouldRun: (({ state: { energy } }) => energy > 0),
            payload: {
                texture: 'glow',
                width: 150,
                height: 150,
                tint: 0xFFFFFF,
            },
        },
    ],
    zIndex: 2,
};
