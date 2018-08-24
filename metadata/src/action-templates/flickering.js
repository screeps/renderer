export default (alpha1, alpha2, alpha3, alpha4) => ({
    action: 'Spawn',
    params: [[
        {
            action: 'Repeat',
            params: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'ScaleTo',
                        params: [
                            { $rel: 'scale.x', koef: 1.2 },
                            { $rel: 'scale.y', koef: 1.2 },
                            1,
                        ],
                    },
                    {
                        action: 'ScaleTo',
                        params: [
                            { $rel: 'scale.x' },
                            { $rel: 'scale.y' },
                            1,
                        ],
                    },
                ]],
            }],
        },
        {
            action: 'Repeat',
            params: [{
                action: 'Sequence',
                params: [[
                    {
                        action: 'AlphaTo',
                        params: [alpha1, 0.1],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha2, 0.2],
                    },
                    {
                        action: 'DelayTime',
                        params: [{ $random: 2 }],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha3, 0.2],
                    },
                    {
                        action: 'AlphaTo',
                        params: [alpha4, 2.8],
                    },
                ]],
            }],
        },
    ]],
});
