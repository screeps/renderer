/**
 * Created by vedi on 23/04/2017.
 */

import mathHelper from '../../../helpers/mathHelper';

import { displayName } from '../action-templates';
import { resourceTotal } from '../calculation-templates';

const CELL_SIZE = 100;
const ENERGY_RADIUS = 20;
const isNpc = ({ state: { user } }) => user === '3' || user === '2';
const isNotNpc = (...params) => !isNpc(...params);

export default {
    texture: 'creep',
    calculations: [
        {
            id: 'displayName',
            func: ({ calcs: { isOwner }, state: { name, user }, stateExtra: { users } }) =>
                (isOwner ? name : users[user].username),
        },
        {
            id: 'rotation',
            props: ['x', 'y'],
            func: ({ prevState: { x: prevX, y: prevY } = {}, state: { x, y } }) => {
                const { calculateAngle } = mathHelper;
                return (prevX !== undefined && prevY !== undefined ?
                    calculateAngle(prevX, prevY, x, y) : 0);
            },
        },
        resourceTotal(),
        {
            id: 'resourcesTotalRadius',
            func: ({ state: { storeCapacity }, calcs: { resourcesTotal } }) =>
                Math.min(1, resourcesTotal / storeCapacity) * ENERGY_RADIUS,
        },
        {
            id: 'energyRadius',
            func: ({ state: { store, storeCapacity } }) =>
                Math.min(1, (store['energy']||0) / storeCapacity) * ENERGY_RADIUS,
        },
        {
            id: 'powerRadius',
            func: ({ state: { store, storeCapacity } }) =>
                Math.min(1, ((store['energy']||0) + (store['power']||0)) / storeCapacity) * ENERGY_RADIUS,
        },
        {
            id: 'safeMode',
            func: ({
                stateExtra,
                state: { user },
                stateExtra: { controller, gameTime, objects },
            }) => {
                if (controller === undefined) {
                    controller = objects.find(i => i.type === 'controller') || null;
                    stateExtra.controller = controller;
                }
                return controller && controller.safeMode > gameTime && controller.user !== user ?
                    0.5 : 1.0;
            },
        },
    ],
    processors: [
        {
            type: 'container',
            once: 'true',
            payload: {
                id: 'mainContainer',
            },
        },
        {
            type: 'container',
            once: 'true',
            payload: {
                id: 'decorationContainer',
                parentId: 'mainContainer',
            },
        },
        {
            type: 'creepDecoration',
            props: ['spawning', 'decorations'],
            when: (({ state: { spawning } }) => !spawning),
            payload: {
                parentId: 'decorationContainer',
            },
        },
        {
            type: 'circle',
            once: true,
            payload: {
                parentId: 'mainContainer',
                color: 0x202020,
                radius: 50,
            },
            when: isNotNpc,
        },
        {
            type: 'creepBuildBody',
            props: ['body'],
            payload: {
                parentId: 'mainContainer',
            },
            when: isNotNpc,
        },
        {
            type: 'circle',
            once: true,
            payload: {
                parentId: 'mainContainer',
                color: 0x000000,
                radius: 32,
            },
            when: isNotNpc,
        },
        {
            type: 'userBadge',
            payload: {
                parentId: 'mainContainer',
                radius: 26,
                color: { $calc: 'playerColor' },
            },
            when: isNotNpc,
        },
        {
            type: 'circle',
            props: ['store', 'resourcesTotal'],
            when: ({ state: { store = {}, user }, calcs: { resourcesTotal } }) =>
                user !== '3' && user !== '2' && resourcesTotal > 0 && (store['energy']||0 + store['power']||0 < resourcesTotal),
            payload: {
                parentId: 'mainContainer',
                radius: { $calc: 'resourcesTotalRadius' },
                color: 0xffffff,
            },
        },
        {
            type: 'circle',
            props: ['store'],
            when: ({ state: { store = {}, user } }) => user !== '3' && user !== '2' && store['power'] > 0,
            payload: {
                parentId: 'mainContainer',
                radius: { $calc: 'powerRadius' },
                color: 0xf41f33,
            },
        },
        {
            type: 'circle',
            props: ['store'],
            when: ({ state: { store = {}, user } }) => user !== '3' && user !== '2' && store['energy'] > 0,
            payload: {
                parentId: 'mainContainer',
                radius: { $calc: 'energyRadius' },
                color: 0xffe56d,
            },
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                parentId: 'mainContainer',
                texture: 'creep-npc',
                width: 100,
                height: 100,
            },
            when: isNpc,
        },
        {
            type: 'creepActions',
            payload: {
                parentId: 'mainContainer',
            },
            props: '*',
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            when: ((params) => {
                const { state: { spawning } } = params;
                return !spawning && isNotNpc(params);
            }),
            payload: {
                parentId: 'mainContainer',
                texture: 'creep-mask',
                width: 100,
                height: 100,
                alpha: 1,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            when: isNpc,
            payload: {
                parentId: 'mainContainer',
                texture: 'glow',
                width: 100,
                height: 100,
                alpha: 0.5,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            shouldRun: (({ state: { spawning } }) => !spawning),
            payload: {
                parentId: 'mainContainer',
                texture: 'glow',
                width: 400,
                height: 400,
                alpha: 0.2,
            },
        },
        displayName('creeps', ({ state: { spawning } }) => !spawning),
        {
            type: 'say',
            layer: 'effects',
            when: ({
                state: { actionLog: { say } = {} },
                stateExtra: { gameData: { showCreepSpeech } },
                calcs: { isOwner },
            }) =>
                !!showCreepSpeech && !!say && (say.isPublic || isOwner),
            payload: {
                say: { $state: 'actionLog.say' },
            },
        },
        {
            id: 'rangedMassAttack',
            type: 'circle',
            layer: 'effects',
            once: true,
            payload: {
                alpha: 0,
                color: 0x5d80b2,
                radius: 300,
                blendMode: 1,
            },
        },
        {
            type: 'runAction',
            payload: {
                id: 'rangedMassAttack',
            },
            when: ({ state: { actionLog: { rangedMassAttack } = {} } }) => !!rangedMassAttack,
            actions: [{
                action: 'Sequence',
                params: [[
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
                        action: 'Spawn',
                        params: [[
                            {
                                action: 'Ease',
                                params: [{
                                    action: 'ScaleTo',
                                    params: [1, 1, { $processorParam: 'tickDuration', koef: 0.6 }],
                                }],
                            },
                            {
                                action: 'Ease',
                                params: [{
                                    action: 'AlphaTo',
                                    params: [0, { $processorParam: 'tickDuration', koef: 0.6 }],
                                }],
                            },
                        ]],
                    },
                ]],
            }],
        },
    ],
    actions: [
        {
            id: 'moveTo',
            props: ['x', 'y'],
            actions: [{
                action: 'Ease',
                params: [
                    {
                        action: 'MoveTo',
                        params: [
                            { $state: 'x', koef: CELL_SIZE },
                            { $state: 'y', koef: CELL_SIZE },
                            { $processorParam: 'tickDuration' },
                        ],
                    },
                    'EASE_IN_OUT_QUAD',
                ],
            }],
        },
        {
            id: 'rotateTo',
            props: ['rotation'],
            targetId: 'mainContainer',
            actions: [{
                action: 'RotateTo',
                params: [
                    { $calc: 'rotation' },
                    { $processorParam: 'tickDuration', koef: 0.2 },
                ],
            }],
        },
        {
            id: 'safeModeAlpha',
            props: ['safeMode'],
            targetId: 'mainContainer',
            actions: [{
                action: 'AlphaTo',
                params: [{ $calc: 'safeMode' }, 0],
            }],
        },
    ],
    disappearProcessor: { type: 'disappear' },
    zIndex: 6,
};
