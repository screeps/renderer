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
        colorForeground: '#3333ff',
        alphaForeground: 1.0,
        colorBackground: '#000033',
        colorStroke: '#3333ff',
        colorStrokeLighting: '#404040',
        strokeWidth: 30,
        decoration: {
            type: 'wallLandscape',
            foregroundUrl: 'decorations/landscape.png',
        }
    },
    {
        colorFloorBackground: '#7777dd',
        colorFloorForeground: '#9999ff',
        alphaFloorForeground: 0.2,
        colorSwamp: '#0000ff',
        colorSwampStroke: '#0000cc',
        colorRoads: '#ccccff',
        swampStrokeWidth: 50,
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