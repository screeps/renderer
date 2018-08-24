/**
 * Created by vedi on 19/03/2017.
 */

export default (fromAlpha, toAlpha, toDuration, fromDuration) => ({
    action: 'Sequence',
    params: [[
        {
            action: 'AlphaTo',
            params: [fromAlpha, 0],
        },
        {
            action: 'Repeat',
            params: [{
                action: 'Sequence',
                params: [
                    [
                        {
                            action: 'AlphaTo',
                            params: [toAlpha, toDuration],
                        },
                        {
                            action: 'AlphaTo',
                            params: [fromAlpha, fromDuration],
                        },
                    ],
                ],
            }],
        },
    ]],
});
