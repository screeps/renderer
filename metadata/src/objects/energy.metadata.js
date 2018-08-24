/**
 * Created by vedi on 23/04/2017.
 */

export default {
    processors: [
        {
            type: 'resourceCircle',
        },
        {
            type: 'resourceCircle',
            layer: 'lighting',
            payload: {
                tint: 0xFFFFFF,
            },
        },
    ],
    zIndex: 1,
};
