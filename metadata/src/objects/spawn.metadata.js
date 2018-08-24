/**
 * Created by vedi on 23/04/2017.
 */

import { displayName } from '../action-templates';

const ellipse1 = {
    color: 0xCCCCCC,
    radius: 70,
};

const ellipse2 = {
    color: 0x181818,
    radius: 59,
};

const ellipse3 = {
    color: 0x555555,
    radius: 38,
};

const arc = {
    color: 0xCCCCCC,
    radius: 50,
    startAngle: -Math.PI / 2,
    strokeWidth: 10,
};

export default {
    calculations: [
        {
            id: 'spawningAngle',
            props: ['spawning'],
            func: ({ state: { spawning } }) => {
                const { remainingTime = 0.01, needTime = 0 } = spawning || {};
                return arc.startAngle +
                    (needTime ? (((2 * Math.PI) * (needTime - remainingTime)) / needTime) : 0);
            },
        },
        {
            id: 'resourceScale',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy, energyCapacity } }) =>
                energy / energyCapacity,
        },
        {
            id: 'displayName',
            func: ({ calcs: { isOwner }, state: { name, user }, stateExtra: { users } }) =>
                (isOwner ? name : users[user].username),
        },
    ],
    processors: [
        {
            type: 'circle',
            once: true,
            payload: {
                id: 'static',
                radius: ellipse1.radius,
                color: ellipse1.color,
            },
        },
        {
            type: 'circle',
            once: true,
            payload: {
                id: 'black',
                parentId: 'static',
                radius: ellipse2.radius,
                color: ellipse2.color,
            },
        },
        {
            type: 'userBadge',
            once: true,
            payload: {
                parentId: 'black',
                color: ellipse3.color,
                radius: ellipse3.radius,
            },
        },
        {
            type: 'runAction',
            props: ['spawning'],
            once: true,
            shouldRun: (({ state: { spawning } }) => !!spawning),
            payload: {
                id: 'static',
            },
            actions: [
                {
                    action: 'Repeat',
                    params: [
                        {
                            action: 'Sequence',
                            params: [
                                [
                                    {
                                        action: 'Ease',
                                        params: [
                                            {
                                                action: 'ScaleTo',
                                                params: [
                                                    1.25,
                                                    1.25,
                                                    0.5,
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        action: 'Ease',
                                        params: [
                                            {
                                                action: 'ScaleTo',
                                                params: [
                                                    1,
                                                    1,
                                                    2,
                                                ],
                                            },
                                            'EASE_IN_QUAD',
                                        ],
                                    },
                                ],
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'draw',
            props: ['spawningAngle'],
            payload: {
                id: 'arc',
                parentId: 'static',
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            arc.strokeWidth,
                            arc.color,
                            1,
                        ],
                    },
                    {
                        method: 'arc',
                        params: [
                            0,
                            0,
                            arc.radius,
                            arc.startAngle,
                            { $calc: 'spawningAngle' },
                        ],
                    },
                ],
            },
        },
        {
            id: 'resourceCircle',
            once: true,
            type: 'circle',
            payload: {
                parentId: 'static',
                radius: ellipse3.radius,
                color: 0xffe56d,
                scale: {
                    x: { $calc: 'resourceScale' },
                    y: { $calc: 'resourceScale' },
                },
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            props: ['energy'],
            shouldRun: (({ state: { energy } }) => energy > 0),
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
        {
            id: 'light',
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'glow',
                width: 600,
                height: 600,
                alpha: 0.5,
            },
        },
        {
            type: 'runAction',
            props: ['spawning'],
            shouldRun: (({ state: { spawning } }) => !!spawning),
            once: true,
            payload: {
                id: 'light',
            },
            actions: [
                {
                    action: 'Repeat',
                    params: [
                        {
                            action: 'Sequence',
                            params: [
                                [
                                    {
                                        action: 'Ease',
                                        params: [
                                            {
                                                action: 'AlphaTo',
                                                params: [
                                                    1,
                                                    0.5,
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        action: 'Ease',
                                        params: [
                                            {
                                                action: 'AlphaTo',
                                                params: [
                                                    0.5,
                                                    2,
                                                ],
                                            },
                                            'EASE_IN_QUAD',
                                        ],
                                    },
                                ],
                            ],
                        },
                    ],
                },
            ],
        },
        displayName('spawns'),
    ],
    actions: [
        {
            id: 'resourceScale',
            targetId: 'resourceCircle',
            props: ['resourceScale'],
            actions: [
                {
                    action: 'ScaleTo',
                    params: [
                        { $calc: 'resourceScale' },
                        { $calc: 'resourceScale' },
                        { $processorParam: 'tickDuration' },
                    ],
                },
            ],
        },
    ],
    zIndex: 8,
};
