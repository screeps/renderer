/**
 * Created by vedi on 19/04/2017.
 */

import { PWR_OPERATE_FACTORY } from '@screeps/common/lib/constants';

import { blinking } from '../action-templates';
import { resourceTotal } from '../calculation-templates';

const SPRITE_SIZE = 200;
const CONTAINER_SIZE = 50.0;

const COLOR_CONTAINER = 0x555555;
const COLOR_ENERGY = 0xfadf7e;
const COLOR_POWER = 0xf41f33;
const COLOR_RESOURCE = 0xFFFFFF;

const isCooldown = ({ state: { cooldownTime }, stateExtra: { gameTime } }) =>
    cooldownTime && cooldownTime >= gameTime;
const isNotCooldown = (...params) => !isCooldown(...params);
const isLevel = ({ state: { level } }) => level > 0;
const isPowerOperate = ({ state: { effects }, stateExtra: { gameTime } }) =>
    effects && Object.values(effects).some(({ power, endTime }) =>
        power === PWR_OPERATE_FACTORY && endTime >= gameTime);
const isLevelBlinking = (...params) => isLevel(...params) && !isPowerOperate(...params);
const isNotLevelBlinking = (...params) => !isLevelBlinking(...params);

export default {
    texture: 'rectangle',
    calculations: [
        resourceTotal(),
        {
            id: 'energyBackgroundHeight',
            func: ({ state: { storeCapacity }, calcs: { resourcesTotal } }) =>
                (resourcesTotal * CONTAINER_SIZE) / (storeCapacity || resourcesTotal),
        },
        {
            id: 'energyHeight',
            func: ({ state: { store = {}, storeCapacity }, calcs: { resourcesTotal } }) =>
                ((store['energy']||0) * CONTAINER_SIZE) / (storeCapacity || resourcesTotal),
        },
        {
            id: 'powerHeight',
            func: ({ state: { store = {}, storeCapacity },
                calcs: { resourcesTotal } }) =>
                ((store['power']||0 + store['energy']||0) * CONTAINER_SIZE) / (storeCapacity || resourcesTotal),
        },
        {
            id: 'factory-lvl',
            props: ['level'],
            func: ({ state: { level = 0 } }) => `factory-lvl${level}`,
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'factory-border',
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'factory',
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
            },
        },
        {
            id: 'factory-highlight',
            type: 'sprite',
            once: true,
            payload: {
                texture: 'factory-highlight',
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
                alpha: 0.4
            },
        },
        {
            type: 'runAction',
            when: isCooldown,
            payload: {
                id: 'factory-highlight',
            },
            actions: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'AlphaTo',
                        params: [1, { $processorParam: 'tickDuration', koef: 0.2 }],
                    },
                    {
                        action: 'AlphaTo',
                        params: [0, { $processorParam: 'tickDuration', koef: 0.8 }],
                    },
                ]],
            }]
        },{
            type: 'runAction',
            when: isNotCooldown,
            payload: {
                id: 'factory-highlight',
            },
            actions: [
                {
                    action: 'AlphaTo',
                    params: [0.4, 0],
                },
            ],
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'factory-lvl0',
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
            },
        },
        {
            id: 'level',
            type: 'sprite',
            when: isLevel,
            once: true,
            payload: {
                texture: { $calc: 'factory-lvl' },
                width: SPRITE_SIZE,
                height: SPRITE_SIZE,
            },
        },
        {
            type: 'runAction',
            when: isLevelBlinking,
            once: true,
            payload: {
                id: 'level',
            },
            actions: [
                blinking(0, 1, 0.2, 0.8),
            ],
        },
        {
            type: 'runAction',
            when: isNotLevelBlinking,
            payload: {
                id: 'level',
            },
            actions: [
                {
                    action: 'AlphaTo',
                    params: [1, 0],
                },
            ],
        },
        {
            id: 'internalBorder',
            type: 'sprite',
            once: true,
            payload: {
                width: CONTAINER_SIZE,
                height: CONTAINER_SIZE,
                tint: COLOR_CONTAINER,
            },
        },
        {
            type: 'sprite',
            id: 'otherResourcesBar',
            props: ['store', 'energyBackgroundHeight', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} }, calcs: { resourcesTotal } }) =>
                store['energy']||0 + store['power']||0 < resourcesTotal,
            payload: {
                pivot: {
                    y: { $calc: 'energyBackgroundHeight' },
                },
                y: 25,
                width: CONTAINER_SIZE,
                height: { $calc: 'energyBackgroundHeight' },
                tint: COLOR_RESOURCE,
            },
        },
        {
            id: 'powerBar',
            type: 'sprite',
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} } }) => store['power'] > 0,
            payload: {
                pivot: {
                    y: { $calc: 'powerHeight' },
                },
                y: 25,
                width: CONTAINER_SIZE,
                height: { $calc: 'powerHeight' },
                tint: COLOR_POWER,
            },
        },
        {
            id: 'energyBar',
            type: 'sprite',
            props: ['store', 'resourcesTotal'],
            shouldRun: ({ state: { store = {} } }) => store['energy'] > 0,
            payload: {
                pivot: {
                    y: { $calc: 'energyHeight' },
                },
                y: 25,
                width: CONTAINER_SIZE,
                height: { $calc: 'energyHeight' },
                tint: COLOR_ENERGY,
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            shouldRun: ({ calcs: { resourcesTotal } }) => resourcesTotal > 0,
            payload: {
                texture: 'glow',
                width: 200,
                height: 200,
                alpha: 1,
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                alpha: 0.5,
            },
        },
    ],
    zIndex: 7,
};
