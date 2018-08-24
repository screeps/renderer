/**
 * Created by vedi on 23/04/2017.
 */

const resourceTriangle = {
    color: 0xffe56d,
    x: 0,
    y: 10,
    width: 86,
    height: 118,
};

const gRectangle = {
    color: 0xffffff,
    x: -40,
    y: 35,
    width: 80,
    height: 15,
};

export default {
    calculations: [
        {
            id: 'energyTrianglePoints',
            props: ['energy', 'energyCapacity'],
            func: ({ state: { energy, energyCapacity } }) => {
                const { x, y } = resourceTriangle;
                let { width, height } = resourceTriangle;
                const koef = energy / energyCapacity;
                width *= koef;
                height *= koef;
                return [
                    x - (width / 2), y,
                    x, y - height,
                    x + (width / 2), y,
                ];
            },
        },
        {
            id: 'gWidth',
            func: ({ state: { G: g, GCapacity: gCapacity } }) =>
                (gRectangle.width * g) / gCapacity,
        },
    ],
    processors: [
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'nuker-border',
                width: 300,
                height: 300,
                y: -40,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'nuker',
                width: 300,
                height: 300,
                y: -40,
            },
        },
        {
            type: 'draw',
            props: ['energyTrianglePoints'],
            payload: {
                id: 'energyTriangle',
                drawings: [
                    { method: 'beginFill', params: [resourceTriangle.color] },
                    {
                        method: 'drawPolygon',
                        params: [{ $calc: 'energyTrianglePoints' }],
                    },
                    { method: 'endFill' },
                ],
            },
        },
        {
            type: 'draw',
            props: ['gWidth'],
            payload: {
                id: 'gRectangle',
                drawings: [
                    { method: 'beginFill', params: [gRectangle.color] },
                    {
                        method: 'drawRect',
                        params: [
                            { $calc: 'gWidth', koef: -0.5 },
                            gRectangle.y,
                            { $calc: 'gWidth' },
                            gRectangle.height,
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
            payload: {
                texture: 'glow',
                width: 100,
                height: 100,
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
};
