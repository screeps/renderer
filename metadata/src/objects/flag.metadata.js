const CELL_SIZE = 100;

export default {
    calculations: [
        {
            id: 'color',
            props: ['color'],
            func: ({ state: { color } }) =>
                color ? parseInt(color.substring(1), 16) : undefined,
        },
    ],

    processors: [
        {
            type: 'sprite',
            props: ['user'],
            layer: 'effects',
            payload: {
                texture: 'flag',
                width: 200,
                height: 200,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'sprite',
            props: ['color'],
            layer: 'effects',
            payload: {
                texture: 'flag-secondary',
                width: 200,
                height: 200,
                tint: { $calc: 'color' },
            },
            when: ({ state: { color } }) => !!color,
        }
    ],
    actions: [
        {
            id: 'moveTo',
            props: ['x', 'y'],
            actions: [{
                action: 'MoveTo',
                params: [
                    { $state: 'x', koef: CELL_SIZE },
                    { $state: 'y', koef: CELL_SIZE },
                    0,
                ],
            }],
        },
    ],
};
