export default [
    {
        x: 20.5,
        y: 12,
        width: 14,
        height: 14,
        flip: true,
        rotation: 10 * Math.PI / 180,
        color1: '#8888ff',
        color2: '#aa55aa',
        color3: '#ff9999',
        brightness: 1.0,
        hasRing: false,
        alpha: 0.9,
        animation: 'neon',
        lighting: true,
        decoration: {
            type: 'wallGraffiti',
            graphics: [
                {
                    url: 'decorations/test1.svg',
                    color: 'color1'
                },
                {
                    url: 'decorations/test2.svg',
                    color: 'color2',
                    visible: 'hasRing',
                },
                {
                    url: 'decorations/test3.svg',
                    color: 'color3',
                    visible: 'hasRing',
                }
            ]
        }
    },
    /* {
        x: 0,
        y: 35,
        width: 10,
        height: 30,
        tileScale: 1.5,
        flip: true,
        color1: '#999999',
        hasRing: true,
        decoration: {
            type: 'wallGraffiti',
            tiling: true,
            graphics: [
                {
                    url: 'decorations/test_tile.png',
                    color: 'color1'
                }
            ]
        }
    },*/
    {
        foregroundColor: '#3333ff',
        foregroundAlpha: 1.0,
        foregroundBrightness: 1.0,
        backgroundColor: '#0000ff',
        backgroundBrightness: 0.4,
        strokeColor: '#3333ff',
        strokeBrightness: 0.5,
        strokeLighting: 0.4,
        strokeWidth: 30,
        decoration: {
            type: 'wallLandscape',
            foregroundUrl: 'decorations/landscape.png',
        }
    },
    {
        floorBackgroundColor: '#7777dd',
        floorBackgroundBrightness: 0.7,
        floorForegroundColor: '#9999ff',
        floorForegroundAlpha: 0.2,
        floorForegroundBrightness: 1.0,
        swampColor: '#0000ff',
        swampStrokeColor: '#0000cc',
        swampStrokeWidth: 50,
        roadsColor: '#ccccff',
        roadsBrightness: 0.8,
        decoration: {
            type: 'floorLandscape',
            floorForegroundUrl: 'decorations/landscape2.png',
            tileScale: 3,
        }
    },
    {
        user: '58901b93730b9dab5857f7a6',
        nameFilter: 'EnergyHauler',
        exclude: false,
        firstColor: '#A4FF99',
        firstAlpha: 1.0,
        secondColor: '#FFFFFF',
        secondAlpha: 0.5,
        brightness: 0.3,
        lighting: true,
        animation: 'fast',
        position: 'below',
        width: 184,
        height: 184,
        syncRotate: true,
        flip: false,
        decoration: {
            type: 'creep',
            graphics: [
                {
                    url: 'decorations/creep_effect1.svg',
                    color: 'firstColor',
                    alpha: 'firstAlpha'
                },
                {
                    url: 'decorations/creep_effect2.svg',
                    color: 'secondColor',
                    alpha: 'secondAlpha'
                }
            ]
        }
    },
    // {
    //     decoration: {
    //         type: 'metadata',
    //         objectType: 'controller',
    //         resources: {
    //             'controller-decoration': 'decorations/controller.png'
    //         },
    //         metadata: {
    //             processors: [
    //                 {
    //                     type: 'sprite',
    //                     once: true,
    //                     payload: {
    //                         texture: 'controller-decoration',
    //                         width: 200,
    //                         height: 200,
    //                     },
    //                     actions: [
    //                         {
    //                             action: 'Repeat',
    //                             params: [
    //                                 {
    //                                     action: 'RotateBy',
    //                                     params: [
    //                                         Math.PI,
    //                                         10,
    //                                     ],
    //                                 },
    //                             ],
    //                         },
    //                     ],
    //                 },
    //             ],
    //             zIndex: 4,
    //         }
    //     }
    // },
    {
        user: '54bff72ab32a10f73a57d017',
        width: 350,
        height: 350,
        animation: 'fast',
        decoration: {
            type: 'object',
            objectType: 'controller',
            graphics: [
                {
                    url: 'https://s3.amazonaws.com/static.screeps.com/season1/controller_season1.svg',
                }
            ]
        }
    }
];