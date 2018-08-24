/**
 * Created by vedi on 23/04/2017.
 */

export default {
    processors: [
        {
            type: 'circle',
            once: true,
            payload: {
                radius: 45,
                color: 0x111133,
                alpha: 0.5,
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
                                        action: 'AlphaTo',
                                        params: [0.5, 0],
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
                radius: 40,
                color: 0x61c0ed,
                alpha: 0.5,
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
                                        action: 'AlphaTo',
                                        params: [0.5, 0],
                                    },
                                ]],
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
                                action: 'Spawn',
                                params: [[
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
                                ]],
                            },

                        ],
                    ],
                }],
            }],
            payload: {
                radius: 40,
                color: 0x111133,
                alpha: 0.5,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'glow',
                width: 700,
                height: 700,
                tint: 0x9999FF,
                alpha: 0.7,
            },
            actions: [{
                action: 'Spawn',
                params: [[
                    {
                        action: 'Repeat',
                        params: [{
                            action: 'Sequence',
                            params: [[
                                {
                                    action: 'ScaleTo',
                                    params: [
                                        { $rel: 'scale.x', koef: 1.2 },
                                        { $rel: 'scale.y', koef: 1.2 },
                                        2,
                                    ],
                                },
                                {
                                    action: 'ScaleTo',
                                    params: [
                                        { $rel: 'scale.x' },
                                        { $rel: 'scale.y' },
                                        2,
                                    ],
                                },
                            ]],
                        }],
                    },
                    {
                        action: 'Repeat',
                        params: [{
                            action: 'Sequence',
                            params: [[
                                {
                                    action: 'AlphaTo',
                                    params: [0.1, 3.5],
                                },
                                {
                                    action: 'AlphaTo',
                                    params: [0.7, 3.5],
                                },
                            ]],
                        }],
                    },
                ]],
            }],
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'glow',
                width: 150,
                height: 150,
                tint: 0x7777FF,
            },
        },
    ],
    zIndex: 3,
};
