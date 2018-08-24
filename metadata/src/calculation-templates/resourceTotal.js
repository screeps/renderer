/**
 * Created by vedi on 19/03/2017.
 */

import constants from '@screeps/common/lib/constants';

export default () => {
    const { RESOURCES_ALL } = constants;
    return ({
        id: 'resourcesTotal',
        func: ({ state }) => {
            let resourcesTotal = 0;
            RESOURCES_ALL.forEach((resourceName) => {
                if (state[resourceName]) {
                    resourcesTotal += state[resourceName];
                }
            });
            return resourcesTotal;
        },
    });
};
