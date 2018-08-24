/**
 * Created by vedi on 23/04/2017.
 */

export default {
    processors: [
        {
            type: 'circle',
            once: true,
            payload: {
                radius: 60,
                color: 0x000000,
            },
        },
        {
            type: 'circle',
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
                                        action: 'FadeIn',
                                        params: [0],
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
                radius: 50,
                color: 0x780207,
            },
        },
        {
            type: 'circle',
            once: true,
            actions: [{
                action: 'Repeat',
                params: [{
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'ScaleTo',
                                params: [0, 0, 0],
                            },
                            {
                                action: 'ScaleTo',
                                params: [
                                    { $rel: 'scale.x', koef: 0.3 },
                                    { $rel: 'scale.y', koef: 0.3 },
                                    1,
                                ],
                            },
                            {
                                action: 'ScaleTo',
                                params: [
                                    { $rel: 'scale.x' },
                                    { $rel: 'scale.y' },
                                    1,
                                ],
                            },
                        ],
                    ],
                }],
            }],
            payload: {
                radius: 50,
                color: 0x000000,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                alpha: 0.5,
                tint: 0xFF0000,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'glow',
                width: 150,
                height: 150,
            },
        },
    ],
    zIndex: 3,
};
