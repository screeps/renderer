import constants from '@screeps/common/lib/constants';

const arc = {
    color: 0xCCCCCC,
    radius: 40,
    startAngle: -Math.PI / 2,
    strokeWidth: 10,
};

export default {
    calculations: [
        {
            id: 'spawningAngle',
            props: ['spawning'],
            func: ({ state: { spawning } }) => {
                const { remainingTime = 0.01, needTime = 0 } = spawning || {};
                return arc.startAngle +
                    (needTime ? (((2 * Math.PI) * (needTime - remainingTime)) / needTime) : 0);
            },
        },
        {
            id: 'ttl',
            func: ({ state: { decayTime }, stateExtra: { gameTime } }) =>
                Math.floor((decayTime - gameTime) / 100) * 100,
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'invaderCore',
                width: 200,
                height: 200,
            },
        },
        {
            type: 'siteProgress',
            payload: {
                color: 0xff0d39,
                radius: 23,
                lineWidth: 0,
                progress: { $calc: 'ttl' },
                progressTotal: constants.STRONGHOLD_DECAY_TICKS,
            },
        },
        {
            type: 'draw',
            props: ['spawningAngle'],
            payload: {
                id: 'arc',
                drawings: [
                    {
                        method: 'lineStyle',
                        params: [
                            arc.strokeWidth,
                            arc.color,
                            1,
                        ],
                    },
                    {
                        method: 'arc',
                        params: [
                            0,
                            0,
                            arc.radius,
                            arc.startAngle,
                            { $calc: 'spawningAngle' },
                        ],
                    },
                ],
            },
        },
        {
            type: 'creepActions',
            props: '*',
        },
        {
            type: 'sprite',
            once: true,
            layer: 'lighting',
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
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
                tint: 0xFF8080,
            },
        },

    ],
    zIndex: 17,
};
