/**
 * Created by vedi on 04/09/2017.
 */
export default {
    processors: [
        {
            id: 'main',
            type: 'sprite',
            once: 'true',
            payload: {
                texture: 'extractor',
                width: 200,
                tint: { $calc: 'playerColor' },
            },
        },
        {
            type: 'runAction',
            once: true,
            when: ({ state: { cooldown } }) => cooldown > 0,
            until: ({ state: { cooldown } }) => !cooldown || cooldown <= 0,
            payload: {
                id: 'main',
            },
            actions: [{
                action: 'Repeat',
                params: [{
                    action: 'RotateBy',
                    params: [2 * Math.PI, 4],
                }],
            }],
        },
    ],
    zIndex: 0,
};
