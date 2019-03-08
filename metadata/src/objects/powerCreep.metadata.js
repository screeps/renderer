/**
 * Created by vedi on 23/04/2017.
 */

import { calculateAngle } from '../../../helpers/mathHelper';

const CELL_SIZE = 100;

const BADGE_GEOMETRY = {
    commander: {
        pivotY: 30,
        size: 65,
    },
    executor: {
        pivotY: 30,
        size: 45,
    },
    operator: {
        pivotY: 20,
        size: 75,
    },
};

export default {
    calculations: [
        {
            id: 'rotation',
            props: ['x', 'y'],
            func: ({ prevState: { x: prevX, y: prevY } = {}, state: { x, y } }) => {
                return (prevX !== undefined && prevY !== undefined ?
                    calculateAngle(prevX, prevY, x, y) : 0);
            },
        },
        {
            id: 'texture',
            props: ['level'],
            func: ({ state: { level, className } }) => `${className}-lvl${Math.min(4, Math.ceil(level / 6))}`,
        },
        {
            id: 'texture-light',
            func: ({ state: { className } }) => `${className}-lvl4`,
        },
        {
            id: 'badgePivotY',
            props: ['className'],
            func: ({ state: { className } }) => BADGE_GEOMETRY[className].pivotY,
        },
        {
            id: 'badgeSize',
            props: ['className'],
            func: ({ state: { className } }) => BADGE_GEOMETRY[className].size,
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
            type: 'sprite',
            props: ['texture'],
            payload: {
                id: 'sprite',
                parentId: 'mainContainer',
                texture: { $calc: 'texture' },
                width: 180,
                height: 180,
                zIndex: 0,
                tint: 0xcc3d3e,
            },
        },
        {
            type: 'userBadge',
            props: ['texture'],
            payload: {
                parentId: 'mainContainer',
                radius: 26,
                color: 0x222222,
                width: { $calc: 'badgeSize' },
                height: { $calc: 'badgeSize' },
                pivot: {
                    y: { $calc: 'badgePivotY' },
                },
            },
        },
        {
            type: 'creepActions',
            payload: {
                parentId: 'mainContainer',
            },
            props: '*',
        },
        {
            type: 'powerInfluence',
            payload: {
                parentId: 'mainContainer',
            },
            props: '*',
        },
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
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                parentId: 'mainContainer',
                texture: { $calc: 'texture' },
                width: 180,
                height: 180,
                alpha: 1.0,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                parentId: 'mainContainer',
                texture: 'glow',
                width: 400,
                height: 400,
                alpha: 1.0,
                tint: 0xFF5555,
            },
        },
        {
            type: 'sprite',
            layer: 'effects',
			once: true,
			when: ({ state: { actionLog: { spawned } = {} } }) => !!spawned,
            payload: {
				texture: 'flare2',				
				width: 400,
				height: 400,
				alpha: 1,
                blendMode: 1,
                tint: 0xff1111,
            },
            actions: [
                {
                    action: 'Sequence',
                    params: [[
                        {
                            action: 'Spawn',
                            params: [[
                                {
                                    action: 'AlphaTo',
									params: [0.0, { $processorParam: 'tickDuration', koef: 0.5 }],                                       
                                },
								{
                                    action: 'RotateBy',
									params: [Math.PI / 8, { $processorParam: 'tickDuration', koef: 0.5 }],                                       
                                },
                            ]],
                        },
                    ]],
                },
            ],
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
    zIndex: 13,
};
