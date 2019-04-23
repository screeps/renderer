/**
 * Created by vedi on 31/08/2017.
 */

const mineralPath = {
    texture: 'lab-mineral',
    tint: 0x777777,
    anchor: {
        y: 1,
    },
    scale: {
        x: 0.6875,
        y: 0.6875,
    },
    y: 25,
};

const mineralColorActive = 0xffffff;

const energyRectangle = {
    color: 0xffe56d,
    x: -40,
    y: 32,
    width: 67,
    height: 10,
};

const isCooldown = ({ state: { cooldownTime }, stateExtra: { gameTime } }) =>
    cooldownTime && cooldownTime > gameTime;

export default {
    calculations: [
        {
            id: 'mineralPathScale',
            props: ['mineralAmount', 'mineralCapacity'],
            func: ({ state: { mineralAmount, mineralCapacity } }) => {
                const { scale: { x: scale } } = mineralPath;
                return (scale * mineralAmount) / mineralCapacity;
            },
        },
        {
            id: 'energyWidth',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy, energyCapacity } }) =>
                (energyRectangle.width * energy) / energyCapacity,
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'lab',
                width: 200,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: 'true',
            id: 'lab-highlight',
            payload: {
                texture: 'lab-highlight',
                width: 200,
                alpha: 0,
            },
        },
        {
            type: 'runAction',
            when: isCooldown,
            payload: {
                id: 'lab-highlight',
            },
            actions: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'AlphaTo',
                        params: [0.5, { $processorParam: 'tickDuration', koef: 0.2 }],
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
            once: 'true',
            payload: mineralPath,
        },
        {
            type: 'sprite',
            props: ['mineralPathScale'],
            payload: Object.assign(
                { },
                mineralPath,
                {
                    scale: { x: { $calc: 'mineralPathScale' }, y: { $calc: 'mineralPathScale' } },
                    tint: mineralColorActive,
                }
            ),
        },
        {
            type: 'draw',
            props: ['energyWidth'],
            payload: {
                id: 'energyRectangle',
                drawings: [
                    { method: 'beginFill', params: [energyRectangle.color] },
                    {
                        method: 'drawRect',
                        params: [
                            { $calc: 'energyWidth', koef: -0.5 },
                            energyRectangle.y,
                            { $calc: 'energyWidth' },
                            energyRectangle.height,
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'creepActions',
            props: '*',
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            shouldRun: (({ state: { mineralAmount } }) => mineralAmount > 0),
            payload: {
                texture: 'glow',
                width: 150,
                height: 150,
                alpha: 1,
            },
        },
        {
            id: 'light',
            type: 'sprite',
            once: true,
            layer: 'lighting',
            props: ['mineralAmount'],
            shouldRun: (({ state: { mineralAmount } }) => mineralAmount > 0),
            payload: {
                texture: 'glow',
                width: 500,
                height: 500,
                alpha: 0.3,
            },
        },
        {
            id: 'reactionLight',
            type: 'sprite',
            layer: 'effects',
            once: true,
            payload: {
                texture: 'glow',
                width: 150,
                height: 150,
                alpha: 0,
                blendMode: 1,
            },
        },
        {
            type: 'runAction',
            shouldRun: (({ state }) => state.actionLog && state.actionLog.runReaction),
            payload: {
                id: 'reactionLight',
            },
            actions: [
                {
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'DelayTime',
                                params: [{ $processorParam: 'tickDuration', koef: 0.3 }],
                            },
                            {
                                action: 'AlphaTo',
                                params: [1.0, { $processorParam: 'tickDuration', koef: 0.15 }],
                            },
                            {
                                action: 'AlphaTo',
                                params: [0.0, { $processorParam: 'tickDuration', koef: 0.55 }],
                            },
                        ],
                    ],
                },
            ],
        },
    ],
    zIndex: 15,
};
