/**
 * Created by vedi on 18/08/2017.
 */

import mathHelper from '../../../helpers/mathHelper';

const ENERGY_BAR_FULL_HEIGHT = 66.7;
const isNpc = ({ state: { user } }) => user === '3' || user === '2';
const isNotNpc = (...params) => !isNpc(...params);

/**
 * Sprite for base.
 * Sprite for rotatable area.
 * Drawable energy bar with formula `energy / energyCapacity`
 * Shot animation
 * Autorotation:
 *  1. To shot destination, or
 *  2. To random value in idling state.
 */
export default {
    calculations: [
        {
            id: 'shotAnim',
            func: ({ state: { actionLog } }) =>
                actionLog.attack || actionLog.heal || actionLog.repair,
        },
        {
            id: 'rotation',
            func: ({ state: { x, y }, calcs: { shotAnim } }) => {
                const { calculateAngle } = mathHelper;
                if (!shotAnim) {
                    return 0;
                }
                return calculateAngle(shotAnim.x, shotAnim.y, x, y);
            },
        },
        {
            id: 'energyBarHeight',
            props: ['store', 'storeCapacityResource'],
            func: ({ state: { store, storeCapacityResource } }) => {
                const result = storeCapacityResource && storeCapacityResource.energy ?
                    (ENERGY_BAR_FULL_HEIGHT * store.energy) / storeCapacityResource.energy : 0;
                return Math.min(result, ENERGY_BAR_FULL_HEIGHT);
            },
        },
        {
            id: 'energyBarBorderRadius',
            props: ['store', 'storeCapacity'],
            func: ({ calcs: { energyBarHeight } }) => Math.min(12, energyBarHeight / 2),
        },
    ],
    processors: [
        {
            type: 'sprite',
            props: ['user'],
            payload: {
                texture: 'tower-base',
                tint: { $calc: 'playerColor' },
                width: 200,
                height: 200,
            },
        },
        {
            type: 'sprite',
            props: ['user'],
            when: isNotNpc,
            payload: {
                id: 'towerRotatable',
                texture: 'tower-rotatable',
                pivot: {
                    y: 32,
                },
                width: 115,
                height: 115,
            },
            actions: [{
                action: 'RotateTo',
                params: [{ $random: Math.PI * 2 }, 0],
            }],
        },
        {
            type: 'sprite',
            props: ['user'],
            when: isNpc,
            payload: {
                id: 'towerRotatable',
                texture: 'tower-rotatable-npc',
                pivot: {
                    y: 32,
                },
                width: 115,
                height: 115,
            },
            actions: [{
                action: 'RotateTo',
                params: [{ $random: Math.PI * 2 }, 0],
            }],
        },
        {
            type: 'creepActions',
            props: '*',
            layer: 'effects',
        },
        {
            type: 'runAction',
            payload: {
                id: 'towerRotatable',
            },
            when: ({ calcs: { shotAnim } }) => !!shotAnim,
            actions: [
                {
                    action: 'RotateTo',
                    params: [
                        { $calc: 'rotation' },
                        0.3,
                    ],
                },
            ],
        },
        {
            type: 'runAction',
            once: true,
            payload: {
                id: 'towerRotatable',
            },
            when: ({ calcs: { shotAnim } }) => !shotAnim,
            actions: [
                {
                    action: 'Repeat',
                    params: [
                        {
                            action: 'RotateBy',
                            params: [
                                Math.PI,
                                10,
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'draw',
            when: isNotNpc,
            payload: {
                parentId: 'towerRotatable',
                drawings: [
                    { method: 'beginFill', params: [0xffe56d] },
                    {
                        method: 'drawRoundedRect',
                        params: [
                            -45,
                            0,
                            90,
                            { $calc: 'energyBarHeight' },
                            { $calc: 'energyBarBorderRadius' },
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: (({ state: { store } }) => store.energy > 0),
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
        {
            id: 'light',
            once: true,
            type: 'sprite',
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 600,
                height: 600,
                alpha: 0.5,
            },
        },
        {
            type: 'runAction',
            shouldRun: (({ state: { actionLog: { repair, heal, attack } = {} } }) =>
                repair || heal || attack),
            payload: {
                id: 'light',
            },
            actions: [
                {
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'AlphaTo',
                                params: [1.0, { $processorParam: 'tickDuration', koef: 0.1 }],
                            },
                            {
                                action: 'AlphaTo',
                                params: [0.5, { $processorParam: 'tickDuration', koef: 0.3 }],
                            },
                        ],
                    ],
                },
            ],
        },
        {
            id: 'flare',
            once: true,
            type: 'sprite',
            layer: 'effects',
            payload: {
                texture: 'flare1',
                width: 400,
                height: 400,
                alpha: 0,
                blendMode: 1,
            },
        },
        {
            type: 'runAction',
            when: ({ calcs: { shotAnim } }) => !!shotAnim,
            payload: {
                id: 'flare',
            },
            actions: [
                {
                    action: 'Sequence',
                    params: [
                        [
                            {
                                action: 'AlphaTo',
                                params: [0.2, { $processorParam: 'tickDuration', koef: 0.1 }],
                            },
                            {
                                action: 'AlphaTo',
                                params: [0.0, { $processorParam: 'tickDuration', koef: 0.3 }],
                            },
                        ],
                    ],
                },
            ],
        },
    ],
    zIndex: 13,
};
