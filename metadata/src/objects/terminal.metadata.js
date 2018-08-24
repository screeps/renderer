/**
 * Created by vedi on 22/08/2017.
 */

import { resourceTotal } from '../calculation-templates';

const ENERGY_RECT_FULL_SIZE = 76.0;

const isCooldown = ({ state: { cooldownTime }, stateExtra: { gameTime } }) =>
    cooldownTime && cooldownTime >= gameTime;
const isNotCooldown = (...params) => !isCooldown(...params);

export default {
    calculations: [
        resourceTotal(),
        {
            id: 'restResourceSize',
            props: ['energy', 'energyCapacity', 'power', 'resourcesTotal'],
            func: ({
                state: { energy = 0, energyCapacity, power = 0 },
                calcs: { resourcesTotal },
            }) => {
                if (resourcesTotal <= energy + power) {
                    return 0;
                }
                const result = (ENERGY_RECT_FULL_SIZE * resourcesTotal) / energyCapacity;
                return Math.min(result, ENERGY_RECT_FULL_SIZE);
            },
        },
        {
            id: 'powerResourceSize',
            props: ['energy', 'energyCapacity', 'power'],
            func: ({ state: { energy = 0, energyCapacity, power = 0 } }) => {
                const result = (ENERGY_RECT_FULL_SIZE * (energy + power)) / energyCapacity;
                return Math.min(result, ENERGY_RECT_FULL_SIZE);
            },
        },
        {
            id: 'energyResourceHeight',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy = 0, energyCapacity } }) => {
                const result = (ENERGY_RECT_FULL_SIZE * energy) / energyCapacity;
                return Math.min(result, ENERGY_RECT_FULL_SIZE);
            },
        },
        {
            id: 'arrowsAlpha',
            props: ['cooldownTime'],
            func: (...params) => (isCooldown(...params) ? 0.1 : 1),
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'terminal-border',
                width: 200,
                height: 200,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: true,
            payload: {
                texture: 'terminal',
                width: 200,
                height: 200,
            },
        },
        {
            type: 'sprite',
            once: true,
            when: isCooldown,
            payload: {
                texture: 'terminal-arrows',
                width: 200,
                height: 200,
                alpha: 0.1,
            },
        },
        {
            type: 'sprite',
            once: true,
            when: isNotCooldown,
            payload: {
                texture: 'terminal-arrows',
                width: 200,
                height: 200,
            },
        },
        {
            type: 'sprite',
            when: isCooldown,
            payload: {
                texture: 'terminal-highlight',
                width: 200,
                height: 200,
                tint: 0xFFFFFF,
                alpha: 0,
                blendMode: 1,
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
            }],
        },
        {
            type: 'draw',
            payload: {
                drawings: [
                    { method: 'beginFill', params: [0xffffff] },
                    {
                        method: 'drawRect',
                        params: [
                            { $calc: 'restResourceSize', koef: -0.5 },
                            { $calc: 'restResourceSize', koef: -0.5 },
                            { $calc: 'restResourceSize' },
                            { $calc: 'restResourceSize' },
                        ],
                    },
                    { method: 'endFill' },
                    { method: 'beginFill', params: [0xf41f33] },
                    {
                        method: 'drawRect',
                        params: [
                            { $calc: 'powerResourceSize', koef: -0.5 },
                            { $calc: 'powerResourceSize', koef: -0.5 },
                            { $calc: 'powerResourceSize' },
                            { $calc: 'powerResourceSize' },
                        ],
                    },
                    { method: 'endFill' },
                    { method: 'beginFill', params: [0xffe56d] },
                    {
                        method: 'drawRect',
                        params: [
                            { $calc: 'energyResourceHeight', koef: -0.5 },
                            { $calc: 'energyResourceHeight', koef: -0.5 },
                            { $calc: 'energyResourceHeight' },
                            { $calc: 'energyResourceHeight' },
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'sprite',
            layer: 'lighting',
            once: true,
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
            once: true,
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 800,
                height: 800,
                alpha: 0.5,
            },
        },
    ],
    zIndex: 16,
};
