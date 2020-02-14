export default {
    calculations: [
        {
            id: 'rampartColor',
            once: true,
            func: ({ state: { user }, stateExtra: { gameData: { player } } }) =>
                (user === player ? 0x44FF44 : 0xFF4444),
        },
    ],
    processors: [
        {
            type: 'sprite',
            layer: 'effects',
            props: ['isPublic'],
            payload: {
                texture: 'rampart',
                width: 100,
                height: 100,
                alpha: 0.5,
                tint: { $calc: 'rampartColor' },
            },
            shouldRun: ({ state: { isPublic } }) => !!isPublic,
        },
    ],
    zIndex: 0,
};
