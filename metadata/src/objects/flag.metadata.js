const CELL_SIZE = 100;

export default {
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
            type: 'text',
            props: ['user'],
            layer: 'effects',
            shouldRun: ({ stateExtra: { gameData: { showFlagsNames } } }) => !!showFlagsNames,
            payload: {
                text: { $state: 'name' },
                style: {
                    align: 'center',
                    fill: { $calc: 'flagColor' },
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 60,
                    stroke: '#111',
                    strokeThickness: 10,
                },
                anchor: {
                    x: 0.5,
                    y: -0.5,
                },
            },
        },
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
