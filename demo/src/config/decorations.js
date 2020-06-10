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
        hasRing: false,
        alpha: 0.9,
        animation: 'blink',
        decoration: {
            type: 'wallGraffiti',
            lighting: true,
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
        nameRegex: 'EnergyHauler',

        color: '#A4FF99',
        lighting: true,
        animation: 'fast',
        position: 'below',
        width: 184,
        height: 184,
        syncRotate: true,
        decoration: {
            type: 'creep',
            url: 'decorations/creep_effect1.svg',
        }
    }
];