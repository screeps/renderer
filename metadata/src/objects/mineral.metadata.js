/**
 * Created by vedi on 23/04/2017.
 */

import { flickering } from '../action-templates';

const COLORS = {
    L: {
        foreground: 0x89F4A5,
        background: 0x3F6147,
    },
    U: {
        foreground: 0x88D6F7,
        background: 0x1B617F,
    },
    K: {
        foreground: 0x9370FF,
        background: 0x331A80,
    },
    Z: {
        foreground: 0xF2D28B,
        background: 0x594D33,
    },
    X: {
        foreground: 0xFF7A7A,
        background: 0x4F2626,
    },
    O: {
        foreground: 0xCCCCCC,
        background: 0x4D4D4D,
    },
    H: {
        foreground: 0xCCCCCC,
        background: 0x4D4D4D,
    },
};

export default {
    calculations: [
        {
            id: 'foregroundColor',
            once: true,
            func: ({ state: { mineralType } }) => COLORS[mineralType].foreground,
        },
        {
            id: 'backgroundColor',
            once: true,
            func: ({ state: { mineralType } }) => COLORS[mineralType].background,
        },
    ],
    processors: [
        {
            type: 'draw',
            once: true,
            payload: {
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            10,
                            { $calc: 'foregroundColor' },
                            1,
                        ],
                    },
                    { method: 'beginFill', params: [{ $calc: 'backgroundColor' }] },
                    {
                        method: 'drawCircle',
                        params: [
                            0,
                            0,
                            54,
                        ],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'text',
            once: true,
            payload: {
                text: { $state: 'mineralType' },
                style: {
                    align: 'center',
                    fill: { $calc: 'foregroundColor' },
                    fontFamily: 'Roboto, serif',
                    fontSize: 82,
                    fontWeight: 'bold',
                },
                anchor: {
                    x: 0.5,
                    y: 0.5,
                },
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
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
                width: 700,
                height: 700,
                alpha: 0.7,
                tint: { $calc: 'foregroundColor' },
            },
            actions: [flickering(0.7, 0.4, 1.0, 0.4)],
        },
    ],
    zIndex: 2,
};
