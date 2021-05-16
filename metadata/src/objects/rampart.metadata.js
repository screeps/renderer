export default {
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
                tint: { $calc: 'playerColor' },
            },
            shouldRun: ({ state: { isPublic } }) => !!isPublic,
        },
    ],
    zIndex: 0,
};
