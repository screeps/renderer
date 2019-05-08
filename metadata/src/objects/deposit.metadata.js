import { flickering } from '../action-templates';

const scaleAction = {
    action: 'Repeat',
    params: [{
        action: 'Sequence',
        params: [
            [{
                action: 'Ease',
                params: [{
                    action: 'ScaleTo',
                    params: [0.7, 0.7, 1],
                }],
            }, {
                action: 'Ease',
                params: [{
                    action: 'ScaleTo',
                    params: [1.0, 1.0, 0.3],
                }],
            }],
        ],
    }],
};

const COLORS = {
    biomass: 0x84b012,
    metal: 0x956f5c,
    mist: 0xda6bf5,
    silicon: 0x4ca7e5,
};

const isCooldown = ({ state: { cooldownTime }, stateExtra: { gameTime } }) =>
    cooldownTime && cooldownTime >= gameTime;

export default {
    calculations: [
        {
            id: 'deposit',
            props: ['depositType'],
            func: ({ state: { depositType } }) => `deposit-${depositType}`,
        },
        {
            id: 'deposit-fill',
            props: ['depositType'],
            func: ({ state: { depositType } }) => `deposit-${depositType}-fill`,
        },
        {
            id: 'color',
            props: ['depositType'],
            func: ({ state: { depositType } }) => COLORS[depositType],
        },
        {
            id: 'harvested',
            props: ['harvested'],
            func: ({ state: { depositType, harvested = 0 } }) => {
                return Math.max(0, 0.6 - (harvested / 100000));
            },
        },
    ],
    processors: [
        {
            type: 'container',
            once: 'true',
            payload: {
                id: 'container',
            },
        },
        {
            type: 'runAction',
            once: true,
            when: isCooldown,
            payload: {
                id: 'container',
            },
            actions: [scaleAction],
        },
        {
            type: 'sprite',
            payload: {
                parentId: 'container',
                texture: { $calc: 'deposit-fill' },
                width: 160,
                height: 160,
                alpha: { $calc: 'harvested' },
                tint: { $calc: 'color' }
            },
        },
        {
            type: 'sprite',
            payload: {
                parentId: 'container',
                texture: { $calc: 'deposit' },
                width: 160,
                height: 160,
                tint: { $calc: 'color' }
            },
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            payload: {
                parentId: 'container',
                texture: { $calc: 'deposit' },
                width: 160,
                height: 160,
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
                alpha: 1,
                tint: { $calc: 'color' },
            },
            actions: [flickering(0.7, 0.4, 1.0, 0.4)],
        },
    ],
    zIndex: 1,
};
