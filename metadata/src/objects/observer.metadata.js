/**
 * Created by vedi on 23/04/2017.
 */

const ellipseBorder = {
    color: 0x111111,
    strokeWidth: 5,
    width: 45,
    height: 40,
};

const ellipseEye = {
    strokeWidth: 5,
    width: 20,
    height: 20,
};

export default {
    processors: [
        {
            type: 'draw',
            once: true,
            payload: {
                id: 'border',
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            ellipseBorder.strokeWidth,
                            { $calc: 'playerColor' },
                            1,
                        ],
                    },
                    { method: 'beginFill', params: [ellipseBorder.color] },
                    {
                        method: 'drawEllipse',
                        params: [
                            0,
                            0,
                            ellipseBorder.width,
                            ellipseBorder.height,
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'draw',
            once: true,
            payload: {
                id: 'eye',
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [0, 0, 1],
                    },
                    { method: 'beginFill', params: [{ $calc: 'playerColor' }] },
                    {
                        method: 'drawEllipse',
                        params: [
                            0,
                            0,
                            ellipseEye.width,
                            ellipseEye.height,
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
                            action: 'Sequence',
                            params: [[
                                {
                                    action: 'MoveTo',
                                    params: [20, 0, 0.25],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [0.25],
                                },
                                {
                                    action: 'MoveTo',
                                    params: [0, 15, 0.25],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [0.25],
                                },
                                {
                                    action: 'MoveTo',
                                    params: [-20, 0, 0.25],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [0.25],
                                },
                                {
                                    action: 'MoveTo',
                                    params: [0, -15, 0.25],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [0.25],
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
                alpha: 0.5,
            },
        },
    ],
    zIndex: 10,
};
