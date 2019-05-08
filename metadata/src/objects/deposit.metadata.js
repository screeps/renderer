import { flickering } from '../action-templates';

const COLORS = {
    biomass: 0x84b012,
    metal: 0x956f5c,
    mist: 0xda6bf5,
    silicon: 0x4ca7e5,
};


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
                console.log(depositType, '=>', Math.max(0.2, 1 - (harvested / 150000)));
                return Math.max(0.2, 1 - (harvested / 150000));
            },
        },
    ],
    processors: [
        {
            type: 'sprite',
            payload: {
                texture: { $calc: 'deposit-fill' },
                width: 160,
                height: 160,
                alpha: { $calc: 'harvested' },
            },
        },
        {
            type: 'sprite',
            payload: {
                texture: { $calc: 'deposit' },
                width: 160,
                height: 160,
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
                tint: { $calc: 'color' },
            },
            actions: [flickering(0.7, 0.4, 1.0, 0.4)],
        },
    ],
    zIndex: 1,
};
