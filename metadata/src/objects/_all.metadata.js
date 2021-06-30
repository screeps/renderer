/**
 * Created by vedi on 13/09/2017.
 */

import { blinking } from '../action-templates';
import constants from '@screeps/common/lib/constants';

const CELL_SIZE = 100;

export default {
    data: {
        x: { $state: 'x', koef: CELL_SIZE },
        y: { $state: 'y', koef: CELL_SIZE },
    },
    calculations: [
        {
            id: 'isOwner',
            props: ['user'],
            func: ({ state: { user }, stateExtra: { gameData: { player } } }) =>
                // eslint-disable-next-line eqeqeq
                (user === undefined ? undefined : player == user),
        },
        {
            id: 'playerColorHex',
            props: ['user'],
            func: ({ stateExtra: { users }, state: { user } }) => {
                if (users[user] && users[user].color) {
                    return users[user].color;
                } else {
                    return '#ffffff';
                }
            },
        },
        {
            id: 'playerColor',
            props: ['user'],
            func: ({ calcs: { playerColorHex } }) =>
                parseInt(playerColorHex.substr(1), 16),
        },
        {
            id: 'playerColorIntense',
            props: ['user'],
            func: ({ calcs: { isOwner } }) =>
                (isOwner ? 0x00ff00 : 0x00ff00),
        },
        {
            id: 'viewBox',
            func: ({ world: { options: { VIEW_BOX } } }) => VIEW_BOX,
        },
        {
            id: 'hasEffect',
            func: ({ state: { effects }, stateExtra: { gameTime } }) =>
                effects && Object.values(effects).some(effect => !!constants.POWER_INFO[effect.power] && effect.endTime > gameTime),
        },
        {
            id: 'decorations',
            func: ({ world: { decorations = [] } }) => decorations,
        },
    ],
    processors: [
        {
            type: 'objectDecoration',
            props: ['decorations'],
        },
        {
            type: 'draw',
            once: true,
            when: ({ state: { _isDisabled } }) => !!_isDisabled,
            layer: 'effects',
            payload: {
                drawings: [
                    { method: 'beginFill', params: [0xFF0000] },
                    {
                        method: 'drawRect',
                        params: [-50, -50, 100, 100],
                    },
                    { method: 'endFill' },
                ],
                blendMode: 1,
            },
            actions: [blinking(0, 0.5, 0.3, 1.5)],
        },
        {
            type: 'sprite',
            layer: 'effects',
            id: 'flare',
            props: ['hasEffect'],
            payload: {
                texture: 'flare3',
                width: 300,
                height: 300,
                alpha: 0,
                blendMode: 1,
                tint: 0xFF0000,
            },
            when: ({ calcs: { hasEffect } }) => hasEffect,
            actions: [
                {
                    action: 'Repeat',
                    params: [{
                        action: 'Sequence',
                        params: [
                            [
                                {
                                    action: 'AlphaTo',
                                    params: [0.4, 0.2],
                                },
                                {
                                    action: 'AlphaTo',
                                    params: [0, 1],
                                },
                                {
                                    action: 'DelayTime',
                                    params: [2],
                                },
                            ],
                        ],
                    }],
                },
                {
                    action: 'Repeat',
                    params: [{
                        action: 'RotateBy',
                        params: [2 * Math.PI, 1],
                    }],
                }
            ],
        },
    ],
};
