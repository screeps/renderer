const scaleAction = {
    action: 'Repeat',
    params: [
        {
            action: 'Sequence',
            params: [[
                {
                    action: 'Ease',
                    params: [
                        {
                            action: 'ScaleTo',
                            params: [0.6, 0.6, 1],
                        },
                        'EASE_IN_OUT_QUAD',
                    ],
                },
                {
                    action: 'Ease',
                    params: [
                        {
                            action: 'ScaleTo',
                            params: [1, 1, 1],
                        },
                        'EASE_IN_OUT_QUAD',
                    ],
                },
            ]],
        },
    ],
};

const landed = ({ state: { landTime }, stateExtra: { gameTime } }) => landTime <= gameTime;
const notLanded = (...params) => !landed(...params);

export default {
    calculations: [
        {
            id: 'landTimeSpeed',
            func: ({ state: { landTime }, stateExtra: { gameTime } }) => {
                if (landTime <= gameTime) {
                    return Number.MAX_VALUE;
                }
                return Math.max(0.4, ((Math.round((landTime - gameTime) / 100) * 100) / 50000) * 8);
            },
        },
        {
            id: 'offsetToZeroX',
            func: ({ state: { x }, world: { options: { CELL_SIZE } } }) => -(x + 0.5) * CELL_SIZE,
        },
        {
            id: 'offsetToZeroY',
            func: ({ state: { y }, world: { options: { CELL_SIZE } } }) => -(y + 0.5) * CELL_SIZE,
        },
    ],
    processors: [
        {
            type: 'sprite',
            layer: 'effects',
            once: true,
            payload: {
                texture: 'nuke',
                alpha: 0.7,
            },
            when: notLanded,
            actions: [scaleAction],
        },
        {
            type: 'sprite',
            layer: 'effects',
            once: true,
            payload: {
                texture: 'nuke',
                blur: 2,
                blendMode: 3,
            },
            when: notLanded,
            actions: [scaleAction],
        },
        {
            type: 'circle',
            layer: 'effects',
            once: true,
            payload: {
                color: 0xFF2222,
                radius: 110,
                blendMode: 1,
                alpha: 0.5,
            },
            when: notLanded,
            actions: [scaleAction],
        },
        {
            type: 'circle',
            layer: 'effects',
            props: ['landTimeSpeed'],
            payload: {
                color: 0xFF0000,
                radius: 600,
                alpha: 0,
                blendMode: 1,
                blur: 30,
            },
            when: notLanded,
            actions: [
                {
                    action: 'Repeat',
                    params: [
                        {
                            action: 'Sequence',
                            params: [[
                                {
                                    action: 'Spawn',
                                    params: [[
                                        {
                                            action: 'ScaleTo',
                                            params: [0, 0, { $calc: 'landTimeSpeed' }],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0.4, { $calc: 'landTimeSpeed' }],
                                        },
                                        {
                                            action: 'FilterTo',
                                            params: [0, 'blur', 0.5,
                                                { $calc: 'landTimeSpeed', koef: 0.5 }],
                                        },
                                    ]],
                                },
                                {
                                    action: 'Spawn',
                                    params: [[
                                        {
                                            action: 'ScaleTo',
                                            params: [1, 1, 0],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0, 0],
                                        },
                                        {
                                            action: 'FilterTo',
                                            params: [0, 'blur', 30, 0],
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
            when: notLanded,
            payload: {
                texture: 'glow',
                tint: 0xFF4444,
                width: 700,
                height: 700,
            },
        },
        {
            type: 'sprite',
            layer: 'effects',
            once: true,
            payload: {
                texture: 'glow',
                alpha: 1.0,
                tint: 0xff2222,
                width: 1,
                height: 1,
                blendMode: 1,
            },
            when: landed,
            actions: [
                {
                    action: 'Spawn',
                    params: [[
                        {
                            action: 'Ease',
                            params: [
                                {
                                    action: 'ScaleTo',
                                    params: [20, 20, { $processorParam: 'tickDuration' }],
                                },
                            ],
                        },
                        {
                            action: 'AlphaTo',
                            params: [0, { $processorParam: 'tickDuration' }],
                        },
                    ]],
                },
            ],
        },
        {
            type: 'draw',
            once: true,
            layer: 'effects',
            when: landed,
            payload: {
                x: { $calc: 'offsetToZeroX' },
                y: { $calc: 'offsetToZeroY' },
                blendMode: 1,
                alpha: 0.7,
                drawings: [
                    { method: 'beginFill', params: [0xFF0000] },
                    {
                        method: 'drawRect',
                        params: [
                            0,
                            0,
                            { $calc: 'viewBox' },
                            { $calc: 'viewBox' },
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
            actions: [
                {
                    action: 'Ease',
                    params: [
                        {
                            action: 'AlphaTo',
                            params: [0, { $processorParam: 'tickDuration' }],
                        },
                    ],
                },
            ],
        },
    ],
};
