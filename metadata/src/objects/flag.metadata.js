const CELL_SIZE = 100;
const FLAG_COLORS = {
    1: 0xF44336,
    2: 0x9C27B0,
    3: 0x2196F3,
    4: 0x00BCD4,
    5: 0x4CAF50,
    6: 0xFFEB3B,
    7: 0xFF9800,
    8: 0x795548,
    9: 0x9E9E9E,
    10: 0xFFFFFF,
};

export default {
    calculations: [
        {
            id: 'flagColor',
            func: ({ state: { color } }) => FLAG_COLORS[color],
        },
        {
            id: 'flagSecondaryColor',
            func: ({ state: { secondaryColor } }) => FLAG_COLORS[secondaryColor],
        },
    ],
    processors: [
        {
            type: 'sprite',
            props: ['color'],
            layer: 'effects',
            payload: {
                texture: 'flag',
                width: 200,
                height: 200,
                tint: { $calc: 'flagColor' },
            },
        },
        {
            type: 'sprite',
            props: ['secondaryColor'],
            layer: 'effects',
            payload: {
                texture: 'flag-secondary',
                width: 200,
                height: 200,
                tint: { $calc: 'flagSecondaryColor' },
            },
            when: ({ state: { secondaryColor } }) => !!secondaryColor,
        },
        {
            type: 'text',
            props: ['color'],
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
