/**
 * Created by vedi on 19/03/2017.
 */

export default () => {
    return ({
        id: 'resourcesTotal',
        func: ({ state }) => _.reduce(state.store, (sum, cur) => cur + sum, 0)
    });
};
