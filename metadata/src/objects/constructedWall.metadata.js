/**
 * Created by vedi on 23/04/2017.
 */

import { blinking } from '../action-templates';

export default {
    texture: 'constructedWall',
    processors: [
        {
            type: 'sprite',
            once: true,
            payload: {
                width: 100,
                height: 100,
            },
        },
        {
            type: 'draw',
            once: true,
            when: ({ state: { hits, hitsMax } }) => hits === 1 && hitsMax > 1,
            layer: 'effects',
            payload: {
                drawings: [
                    { method: 'beginFill', params: [0xFF0000] },
                    {
                        method: 'drawRect',
                        params: [-50, -50, 100, 100],
                    },
                    { method: 'endFill' },
                ],
                blendMode: 1,
            },
            actions: [blinking(0, 0.2, 0.3, 1.5)],
        },
    ],
    zIndex: 0,
};
