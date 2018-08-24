/**
 * Created by vedi on 23/04/2017.
 */

import { blinking } from '../action-templates';

export default {
    texture: 'constructionSite',
    processors: [
        {
            id: 'siteProgress',
            type: 'siteProgress',
            layer: 'effects',
            props: ['progress', 'progressTotal'],
            payload: {
                color: { $calc: 'playerColor' },
                radius: 20,
                lineWidth: 10,
                progressTotal: { $state: 'progressTotal' },
            },
            actions: [blinking(0.8, 0.3, 1, 1)],
        },
    ],
    disappearProcessor: { type: 'disappear' },
    zIndex: 18,
};
