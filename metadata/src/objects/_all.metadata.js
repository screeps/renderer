/**
 * Created by vedi on 13/09/2017.
 */

import { blinking } from '../action-templates';

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
            id: 'playerColor',
            props: ['user'],
            func: ({ calcs: { isOwner } }) => {
                if (isOwner === undefined) {
                    return 0xBBBBBB;
                } else if (isOwner) {
                    return 0x8fbb93;
                } else {
                    return 0xFF7777;
                }
            },
        },
        {
            id: 'playerColorHex',
            props: ['user'],
            func: ({ calcs: { isOwner } }) =>
                (isOwner ? '#8fbb93' : '#FF7777'),
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
    ],
    processors: [
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
    ],
};
