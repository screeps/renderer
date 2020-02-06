/**
 * Created by vedi on 19/03/2017.
 */

import { Graphics, WebGLRenderer } from 'pixi.js';

const ROAD_COLOR = 0xaaaaaa;
const SIN_45 = Math.sin(Math.PI / 4);

function fillRoads(states) {
    const roads = [];
    states.forEach((state) => {
        const { type, x, y } = state;
        if (type === 'road') {
            if (!roads[x]) {
                roads[x] = [];
            }
            roads[x][y] = state;
        }
    });
    // add padding for easy calculations
    roads.push([]);
    for (let x = 0; x < roads.length; x += 1) {
        if (!roads[x]) {
            roads[x] = [];
        }
    }
    return roads;
}

export default (params) => {
    const {
        rootContainer,
        id,
        scope,
        stateExtra,
        world: {
            app,
            layers: { terrain: terrainLayer },
            options: { CELL_SIZE, lighting = 'normal' },
            decorations,
        },
        state: { x, y } = {},
        stateExtra: { objects },
    } = params;
    const savedObject = scope[id];
    const knownNodes = savedObject ? savedObject.knownNodes : {
        mm: false,
        zm: false,
        pm: false,
        mz: false,
    };
    const newNodes = {
        mm: false,
        zm: false,
        pm: false,
        mz: false,
    };

    let { roads } = stateExtra;
    if (!roads) {
        roads = fillRoads(objects);
        stateExtra.roads = roads;
    }

    newNodes.mm = Boolean(roads[x - 1][y - 1]);
    newNodes.zm = Boolean(roads[x][y - 1]);
    newNodes.pm = Boolean(roads[x + 1][y - 1]);
    newNodes.mz = Boolean(roads[x - 1][y]);

    const decorationFloorLandscape = decorations.find(i => i.decoration.type === 'floorLandscape');

    const shouldRedraw = !savedObject ||
        Object.entries(newNodes).some(([key, value]) => value !== knownNodes[key]) ||
        savedObject.decorationFloorLandscape !== decorationFloorLandscape;

    if (shouldRedraw) {
        const m = 0;
        const r = 0.15 * CELL_SIZE;
        const rb = r * SIN_45;
        const l = CELL_SIZE;
        const lb = l;

        const graphics = new Graphics();
        graphics.parentLayer = terrainLayer;
        graphics.zIndex = 1;
        if (!(app.renderer instanceof WebGLRenderer)) {
            graphics.tint = 0xa0a0a0;
        } else {
            if (lighting === 'disabled') {
                graphics.tint = 0xa0a0a0;
            }
            if (lighting === 'low') {
                graphics.tint = 0xc0c0c0;
            }
        }

        const color = decorationFloorLandscape ?
            parseInt(decorationFloorLandscape.colorRoads.substring(1), 16) :
            ROAD_COLOR;

        graphics.clear();
        graphics.beginFill(color);
        graphics.drawCircle(m, m, r);
        graphics.endFill();

        if (newNodes.mm) {
            graphics.beginFill(color);
            graphics.moveTo(m + rb, m - rb);
            graphics.lineTo(m - rb, m + rb);
            graphics.lineTo(m - rb - lb, (m + rb) - lb);
            graphics.lineTo((m + rb) - lb, (m - rb) - lb);
            graphics.lineTo(m + rb, m - rb);
            graphics.endFill();
        }

        if (newNodes.zm) {
            graphics.beginFill(color);
            graphics.moveTo(m + r, m);
            graphics.lineTo(m - r, m);
            graphics.lineTo(m - r, m - l);
            graphics.lineTo(m + r, m - l);
            graphics.lineTo(m + r, m);
            graphics.endFill();
        }

        if (newNodes.pm) {
            graphics.beginFill(color);
            graphics.moveTo(m - rb, m - rb);
            graphics.lineTo(m + rb, m + rb);
            graphics.lineTo(m + rb + lb, (m + rb) - lb);
            graphics.lineTo((m - rb) + lb, (m - rb) - lb);
            graphics.lineTo(m - rb, m - rb);
            graphics.endFill();
        }

        if (newNodes.mz) {
            graphics.beginFill(color);
            graphics.moveTo(m, m + r);
            graphics.lineTo(m, m - r);
            graphics.lineTo(m - l, m - r);
            graphics.lineTo(m - l, m + r);
            graphics.lineTo(m, m + r);
            graphics.endFill();
        }
        if (savedObject) {
            savedObject.destroy(true);
        }
        graphics.knownNodes = newNodes;
        graphics.decorationFloorLandscape = decorationFloorLandscape;
        scope[id] = graphics;
        rootContainer.addChild(graphics);
        return graphics;
    }
};
