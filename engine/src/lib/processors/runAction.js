/**
 * Created by vedi on 22/08/2017.
 */

export default {
    config: { isOwner: false },
    run: (params) => {
        const {
            rootContainer,
            scope,
            payload: { id } = {},
        } = params;

        return id ? scope[id] : rootContainer;
    },
};
