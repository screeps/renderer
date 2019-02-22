/**
 * Created by vedi on 23/04/2017.
 */

import constants from '@screeps/common/lib/constants';

import { blinking } from '../action-templates';

export default {
    texture: 'controller',
    calculations: [
        {
            id: 'level1Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 1,
        },
        {
            id: 'level2Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 2,
        },
        {
            id: 'level3Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 3,
        },
        {
            id: 'level4Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 4,
        },
        {
            id: 'level5Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 5,
        },
        {
            id: 'level6Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 6,
        },
        {
            id: 'level7Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 7,
        },
        {
            id: 'level8Visible',
            props: ['level'],
            func: ({ state: { level } }) => level >= 8,
        },
        {
            id: 'downgradeOpacity',
            func: ({ state: { level, downgradeTime }, stateExtra: { gameTime } }) => {
                const { CONTROLLER_DOWNGRADE } = constants;

                if (!downgradeTime || !level || !gameTime) {
                    return 0;
                }
                return (CONTROLLER_DOWNGRADE[level] - (downgradeTime - gameTime)) /
                    CONTROLLER_DOWNGRADE[level];
            },
        },
        {
            id: 'progressTotal',
            func: ({ state: { level } }) => {
                const { CONTROLLER_LEVELS } = constants;
                return CONTROLLER_LEVELS[level];
            },
        },
    ],
    processors: [
        {
            type: 'circle',
            once: true,
            payload: {
                alpha: 0.05,
                color: 0x33ff33,
                radius: 110,
            },
            shouldRun: ({ state: { reservation }, stateExtra: { gameData: { player } } }) =>
                reservation && reservation.user === player,
            actions: [blinking(0.05, 0.4, 1, 1)],
        },
        {
            type: 'circle',
            once: true,
            payload: {
                alpha: 0.05,
                color: 0xff3333,
                radius: 110,
            },
            shouldRun: ({
                state: { upgradeBlocked, reservation },
                stateExtra: { gameTime, gameData: { player } },
            }) =>
                (upgradeBlocked && upgradeBlocked > gameTime) ||
                (reservation && reservation.user !== player),
            actions: [blinking(0.05, 0.4, 1, 1)],
        },
        {
            type: 'circle',
            once: true,
            payload: {
                alpha: 0.05,
                color: 0xff3333,
                radius: 110,
            },
            shouldRun: ({
                state: { upgradeBlocked, reservation },
                stateExtra: { gameTime, gameData: { player } },
            }) =>
                (upgradeBlocked && upgradeBlocked > gameTime) ||
                (reservation && reservation.user !== player),
            actions: [blinking(0.05, 0.4, 1, 1)],
        },
        {
            id: 'safeMode1',
            type: 'circle',
            once: true,
            payload: {
                alpha: 0.05,
                color: 0xffd180,
                radius: 110,
            },
            shouldRun: ({ state: { safeMode }, stateExtra: { gameTime } }) =>
                safeMode && safeMode > gameTime,
            actions: [blinking(0.05, 0.4, 1, 1)],
        },
        {
            type: 'circle',
            once: true,
            payload: {
                alpha: 0.05,
                color: 0xffffff,
                radius: 92,
            },
        },
        {
            type: 'sprite',
            layer: 'effects',
            once: true,
            payload: {
                texture: 'glow',
                alpha: 0.1,
                tint: 0xffd180,
                width: 1,
                height: 1,
                blendMode: 1,
            },
            shouldRun: ({ state: { safeMode }, stateExtra: { gameTime } }) =>
                safeMode && safeMode > gameTime,
            actions: [
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
                                            params: [50, 50, 1.5],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0, 1.5],
                                        },
                                    ]],
                                },
                                {
                                    action: 'Spawn',
                                    params: [[
                                        {
                                            action: 'ScaleTo',
                                            params: [0, 0, 0],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0.05, 0],
                                        },
                                    ]],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [6],
                                },
                            ],
                        ],
                    }],
                },
            ],
        },

        {
            type: 'sprite',
            layer: 'effects',
            props: ['isPowerEnabled'],
            payload: {
                texture: 'flare1',
                alpha: 0.4,
                tint: 0xff0000,
                width: 1,
                height: 1,
                blendMode: 1,
            },
            when: ({ state: { isPowerEnabled } }) => !!isPowerEnabled,
            actions: [
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
                                            params: [20, 20, 1.0],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0, 1.0],
                                        },
                                    ]],
                                },
                                {
                                    action: 'Spawn',
                                    params: [[
                                        {
                                            action: 'ScaleTo',
                                            params: [0, 0, 0],
                                        },
                                        {
                                            action: 'AlphaTo',
                                            params: [0.4, 0],
                                        },
                                    ]],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [5],
                                },
                            ],
                        ],
                    }]
                },
            ],
        },

        {
            type: 'sprite',
            once: true,
            payload: {
                tint: 0x000000,
                width: 200,
                height: 200,
            },
        },
        {
            type: 'sprite',
            props: ['level1Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                visible: { $calc: 'level1Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level2Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: (2 * Math.PI) / 8,
                visible: { $calc: 'level2Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level3Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 2 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level3Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level4Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 3 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level4Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level5Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 4 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level5Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level6Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 5 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level6Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level7Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 6 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level7Visible' },
            },
        },
        {
            type: 'sprite',
            props: ['level8Visible'],
            payload: {
                texture: 'controller-level',
                width: 100,
                height: 100,
                anchor: {
                    y: 1,
                },
                rotation: 7 * ((2 * Math.PI) / 8),
                visible: { $calc: 'level8Visible' },
            },
        },
        {
            type: 'userBadge',
            props: ['user', 'level'],
        },
        {
            id: 'siteProgress',
            type: 'siteProgress',
            props: ['progress', 'progressTotal', 'level'],
            payload: {
                color: 0xFFFFFF,
                radius: 37,
                lineWidth: 0,
                progressTotal: { $calc: 'progressTotal' },
            },
            when: ({ state: { progress } }) => progress > 0,
            actions: [blinking(0.8, 0.3, 1, 1)],
        },
        {
            type: 'circle',
            props: ['level'],
            payload: {
                radius: 40,
                strokeColor: 0x080808,
                strokeWidth: 10,
            },
        },
        {
            id: 'downgrade',
            type: 'sprite',
            once: true,
            layer: 'effects',
            payload: {
                alpha: 0,
                width: 200,
                height: 200,
                tint: 0xff3333,
            },
        },
        {
            type: 'runAction',
            payload: {
                id: 'downgrade',
            },
            actions: [
                {
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'AlphaTo',
                                params: [
                                    { $calc: 'downgradeOpacity' },
                                    { $processorParam: 'tickDuration', koef: 0.2 }],
                            },
                            {
                                action: 'AlphaTo',
                                params: [
                                    0,
                                    { $processorParam: 'tickDuration', koef: 0.8 }],
                            },
                        ],
                    ],
                },
            ],
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            props: ['user'],
            payload: {
                texture: 'glow',
                width: 1200,
                height: 1200,
                alpha: 0.5,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            props: ['user'],
            shouldRun: ({ state: { user } }) => !!user,
            payload: {
                texture: 'glow',
                width: 500,
                height: 500,
                alpha: 1,
            },
        },
    ],
    zIndex: 4,
};
