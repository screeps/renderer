export default {
    calculations: [
        {
            id: 'deposit',
            props: ['depositType'],
            func: ({ state: { depositType } }) => `deposit-${depositType}`,
        },
    ],
    processors: [
        {
            type: 'sprite',
            payload: {
                texture: { $calc: 'deposit' },
                width: 160,
                height: 160,
            },
        },
    ],
    zIndex: 1,
};
