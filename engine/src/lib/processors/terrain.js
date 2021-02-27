/**
 * Created by vedi on 28/09/2017.
 */

import {
    BLEND_MODES, extras, filters, Point, RenderTexture, Sprite, Texture,
    WebGLRenderer, Graphics,
} from 'pixi.js';

import pathHelper from '../pathHelper';
import actionHelper from '../utils/actionHelper';
import { colorBrightness, hslToRgbStr, multiply } from '../utils/hsl';

const { TilingSprite } = extras;
const { BlurFilter } = filters;

const WALLS_BLUR = 0.006;
// const SWAMPS_BLUR = 0.017;

function buildSvg(path, { size: { width, height }, VIEW_BOX }, pathOptions) {
    const svgOptions = {
        viewBox: `0 0 ${VIEW_BOX} ${VIEW_BOX}`,
        'shape-rendering': 'optimizeSpeed',
    };
    const svgOptionsStr = Object.entries(svgOptions).map(([key, value]) =>
        `${key}="${encodeURIComponent(value)}"`)
        .join(' ');
    const pathOptionsStr = Object.entries(pathOptions).map(([key, value]) =>
        `${key}="${encodeURIComponent(value)}"`)
        .join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ${
        svgOptionsStr} data-timestamp="${Date.now()}"><path ${pathOptionsStr} d="${path}" /></svg>`;

    const sprite = Sprite.fromImage(`data:image/svg+xml;charset=utf8,${svg}`);
    sprite._generatedSvgTexture = true;
    return sprite;
}

function addTilePositionAnimation(sprite, dx, dy) {
    actionHelper.addTickerHandler(sprite, (time) => {
        sprite.tilePosition.x += time * dx;
        sprite.tilePosition.y += time * dy;
    });
}

export default (params) => {
    const {
        world: {
            app,
            stage,
            decorations,
            layers: { terrain: terrainLayer, lighting: lightingLayer, effects: effectsLayer },
            options: { size: rendererSize },
        },
        state: { gameData: { player, swampTexture = 'animated' }, objects, users = {}, setTerrain },
        world: {
            options: { CELL_SIZE, RENDER_SIZE: size = rendererSize, VIEW_BOX, HALF_CELL_SIZE = CELL_SIZE / 2, lighting = 'normal' },
        },
    } = params;

    const sizeRatio = size.width / VIEW_BOX;

    function setupObject(object, params) {
        stage.addChild(object);
        object.parentLayer = terrainLayer;
        object.x = -CELL_SIZE / 2;
        object.y = -CELL_SIZE / 2;
        object.width = VIEW_BOX;
        object.height = VIEW_BOX;
        Object.assign(object, params);
        return object;
    }
    if (!stage.terrainObjects) {
        stage.terrainObjects = {};
        stage.terrainObjects.wallMask = new Sprite(Texture.EMPTY);
        Object.assign(stage.terrainObjects.wallMask, {
            x: -50,
            y: -50,
            width: VIEW_BOX,
            height: VIEW_BOX,
            renderable: false,
        });
        stage.addChild(stage.terrainObjects.wallMask);
    }
    const { terrainObjects } = stage;
    const decorationWallLandscape = decorations.find(i => i.decoration.type === 'wallLandscape');
    const decorationFloorLandscape = decorations.find(i => i.decoration.type === 'floorLandscape');

    let { previousSwamps } = terrainObjects;
    if (!previousSwamps) {
        previousSwamps = [];
        terrainObjects.previousSwamps = previousSwamps;
    }
    if (setTerrain) {
        previousSwamps = objects.filter(({ type }) => type === 'swamp');
        terrainObjects.previousSwamps = previousSwamps;
    }

    if (decorationFloorLandscape !== terrainObjects.decorationFloorLandscape) {
        terrainObjects.previousSwampsMd5 = null;
    }
    const { result: swampPath, md5: swampMd5 } = pathHelper(params.world.options,
        setTerrain ? [previousSwamps] : [objects, previousSwamps],
        ({ type }) => type === 'swamp',
        terrainObjects.previousSwampsMd5);
    terrainObjects.previousSwampsMd5 = swampMd5;
    if (swampPath) {
        let { swampObjects } = terrainObjects;
        if (swampObjects) {
            swampObjects.forEach(obj => obj.destroy(obj._generatedSvgTexture));
        } else {
            swampObjects = [];
            terrainObjects.swampObjects = swampObjects;
        }
        if (app.renderer instanceof WebGLRenderer) {
            let tint;
            if (lighting === 'disabled') {
                tint = 0x808080;
            } else if (lighting === 'low') {
                tint = 0xa0a0a0;
            } else {
                tint = 0xFFFFFF;
            }
            let fill = swampTexture !== 'disabled' ? '#4a501e' : '#465c03';
            if (decorationFloorLandscape) {
                fill = decorationFloorLandscape.swampColor;
            }
            let stroke = swampTexture !== 'disabled' ? '#4a501e' : '#3b4019';
            if (decorationFloorLandscape) {
                stroke = decorationFloorLandscape.swampStrokeColor;
            }
            swampObjects[0] = setupObject(
                buildSvg(
                    swampPath,
                    { size, VIEW_BOX },
                    {
                        fill,
                        stroke,
                        'stroke-width': decorationFloorLandscape ? decorationFloorLandscape.swampStrokeWidth : 50,
                        'paint-order': 'stroke',
                    }
                ),
                {
                    alpha: 0.4,
                    tint,
                }
            );

            if (swampTexture !== 'disabled') {
                swampObjects[1] = setupObject(buildSvg(swampPath, { size, VIEW_BOX }, { fill: '#fff' }),
                    { alpha: 0.25 });
                swampObjects[2] = setupObject(buildSvg(swampPath, { size, VIEW_BOX }, { fill: '#fff' }),
                    { alpha: 0.25 });
                swampObjects[3] = setupObject(
                    new TilingSprite(stage.resources.noise2.texture, VIEW_BOX, VIEW_BOX),
                    {
                        alpha: lighting === 'normal' ? 0.3 : 0.15,
                        blendMode: BLEND_MODES.ADD,
                        mask: swampObjects[1],
                        tileScale: new Point(10, 10),
                        tint: 0x66FF00,
                    }
                );

                swampObjects[4] = setupObject(
                    new TilingSprite(stage.resources.noise2.texture, VIEW_BOX, VIEW_BOX),
                    {
                        alpha: lighting === 'normal' ? 0.3 : 0.15,
                        blendMode: BLEND_MODES.ADD,
                        tileScale: new Point(14, 14),
                        mask: swampObjects[2],
                        tint: 0x66FF00,
                    }
                );

                if (swampTexture === 'animated') {
                    addTilePositionAnimation(swampObjects[3], 1.5, 1.5);
                    addTilePositionAnimation(swampObjects[4], -1.35, -1.35);
                }
            }
        } else {
            swampObjects[0] = setupObject(
                buildSvg(
                    swampPath,
                    { size, VIEW_BOX },
                    {
                        fill: decorationFloorLandscape ? decorationFloorLandscape.swampColor : '#292b18',
                        stroke: decorationFloorLandscape ? decorationFloorLandscape.swampStrokeColor : '#252715',
                        'stroke-width': decorationFloorLandscape ? decorationFloorLandscape.swampStrokeWidth : 50,
                        'paint-order': 'stroke',
                    }
                )
            );
        }
    }

    // Ramparts
    let { rampartsObjects } = terrainObjects;
    if (!rampartsObjects) {
        rampartsObjects = {};
        terrainObjects.rampartsObjects = rampartsObjects;
    } else {
        Object.entries(rampartsObjects).forEach(([, value]) => {
            value.came = false;
        });
    }
    Object.keys(users).forEach((_id) => {
        const { [_id]: rampartsObject = { md5: '', sprite: null } } = rampartsObjects;
        const { md5: rampartsMd5, result: rampartsPath } = pathHelper(params.world.options,
            [objects],
            ({ type, isPublic, user }) => type === 'rampart' && !isPublic && user === _id,
            rampartsObject.md5, true);
        rampartsObject.md5 = rampartsMd5;
        if (rampartsPath) {
            if (rampartsObject.sprite) {
                rampartsObject.sprite.destroy(rampartsObject.sprite._generatedSvgTexture);
            }
            rampartsObject.sprite = setupObject(buildSvg(
                rampartsPath,
                { size, VIEW_BOX },
                player === _id ? {
                    fill: '#105010',
                    stroke: '#44ff44',
                    'stroke-width': 25,
                    'paint-order': 'stroke',
                } : {
                    fill: '#501010',
                    stroke: '#ff4444',
                    'stroke-width': 25,
                    'paint-order': 'stroke',
                }
            ), {
                alpha: 0.4,
                blendMode: BLEND_MODES.ADD,
                parentLayer: effectsLayer,
            });
        } else if (rampartsPath === false && rampartsObject.sprite) {
            rampartsObject.sprite.destroy(rampartsObject.sprite._generatedSvgTexture);
            rampartsObject.sprite = null;
        }
        rampartsObject.came = true;
        rampartsObjects[_id] = rampartsObject;
    });
    Object.entries(rampartsObjects).forEach(([key, value]) => {
        if (!value.came) {
            if (value.sprite) {
                value.sprite.destroy(value.sprite._generatedSvgTexture);
            }
            delete rampartsObjects[key];
        }
    });

    // Walls
    let { previousWalls } = terrainObjects;
    if (!previousWalls) {
        previousWalls = [];
        terrainObjects.previousWalls = previousWalls;
    }
    if (setTerrain) {
        previousWalls = objects.filter(({ type }) => type === 'wall');
        terrainObjects.previousWalls = previousWalls;
    }
    const objArrays = setTerrain ? [previousWalls] : [objects, previousWalls];

    if (decorationWallLandscape !== terrainObjects.decorationWallLandscape) {
        terrainObjects.previousWallsMd5 = null;
    }
    const { md5, result: wallPath } = pathHelper(params.world.options, objArrays,
        ({ type }) => type === 'wall' || type === 'constructedWall',
        terrainObjects.previousWallsMd5);
    terrainObjects.previousWallsMd5 = md5;

    if (wallPath) {
        let { wallObjects } = terrainObjects;
        const wallObjectsToDestroy = wallObjects || [];
        wallObjects = [];
        terrainObjects.wallObjects = wallObjects;

        if (app.renderer instanceof WebGLRenderer) {
            wallObjects[0] = RenderTexture.create(size.width, size.height);

            wallObjects[1] = setupObject(new Sprite(Texture.WHITE), {
                zIndex: 2,
                visible: false,
            });

            let backgroundFill = lighting === 'disabled' ? '#181818' : '#111';
            let stroke = '#000';
            if (decorationWallLandscape) {
                backgroundFill = colorBrightness(decorationWallLandscape.backgroundColor,
                    decorationWallLandscape.backgroundBrightness);

                stroke = colorBrightness(decorationWallLandscape.strokeColor,
                    decorationWallLandscape.strokeBrightness);

                if (lighting === 'disabled') {
                    backgroundFill = multiply(backgroundFill, 0.5);
                    stroke = multiply(stroke, 0.3);
                }
            }

            const base = buildSvg(
                wallPath,
                { size, VIEW_BOX },
                {
                    fill: backgroundFill,
                    stroke,
                    'stroke-width': decorationWallLandscape ? decorationWallLandscape.strokeWidth : 10,
                    'paint-order': 'stroke',
                });

            actionHelper.onTextureLoaded(base.texture, () => {
                app.renderer.render(base, wallObjects[0]);
                base.destroy(true);
            });

            const mask = buildSvg(wallPath, { size, VIEW_BOX }, { fill: '#fff' });
            if (terrainObjects.wallMask.texture !== Texture.EMPTY) {
                terrainObjects.wallMask.texture.destroy(true);
            }
            terrainObjects.wallMask.texture = mask.texture;
            actionHelper.onTextureLoaded(mask.texture, () => {
                if (lighting !== 'disabled') {
                    const bump = new TilingSprite(stage.resources.noise1.texture, VIEW_BOX,
                        VIEW_BOX);
                    Object.assign(bump, {
                        alpha: 0.2,
                        blendMode: BLEND_MODES.ADD,
                        tileScale: new Point(8 * sizeRatio, 8 * sizeRatio),
                        mask,
                    });
                    app.renderer.render(bump, wallObjects[0], false);
                    bump.destroy();
                }
                mask.destroy();
                actionHelper.enableTextureMipmap(app.renderer, wallObjects[0].baseTexture);
                [wallObjects[1].texture] = wallObjects;
                wallObjects[1].visible = true;
                if (wallObjectsToDestroy[1]) {
                    wallObjectsToDestroy[1].destroy(true);
                }
            });

            wallObjects[2] = RenderTexture.create(size.width, size.height);

            wallObjects[3] = setupObject(new Sprite(Texture.WHITE), {
                parentLayer: lightingLayer,
                _overrideBlendMode: true,
                blendMode: BLEND_MODES.MULTIPLY,
                visible: false,
            });

            const shadow = buildSvg(wallPath, { size, VIEW_BOX }, { fill: '#000' });

            actionHelper.onTextureLoaded(shadow.texture, () => {
                shadow.filters = [new BlurFilter(size.width * WALLS_BLUR)];
                app.renderer.render(shadow, wallObjects[2]);
                shadow.destroy(true);
                actionHelper.enableTextureMipmap(app.renderer, wallObjects[2].baseTexture);
                [,, wallObjects[3].texture] = wallObjects;
                wallObjects[3].visible = true;
                if (wallObjectsToDestroy[3]) {
                    wallObjectsToDestroy[3].destroy(true);
                }
            });

            wallObjects[4] = setupObject(buildSvg(wallPath, { size, VIEW_BOX },
                {
                    fill: '#808080',
                    stroke: decorationWallLandscape ? hslToRgbStr(0, 0, decorationWallLandscape.strokeLighting) : '#000000',
                    'stroke-width': decorationWallLandscape ? decorationWallLandscape.strokeWidth : 10,
                    'paint-order': 'stroke',
                }),
            { parentLayer: lightingLayer, visible: false });

            actionHelper.onTextureLoaded(wallObjects[4].texture, () => {
                wallObjects[4].visible = true;
                if (wallObjectsToDestroy[4]) {
                    wallObjectsToDestroy[4].destroy(true);
                }
            });
        } else {
            wallObjects[0] = setupObject(buildSvg(
                wallPath,
                { size, VIEW_BOX },
                { fill: '#111', stroke: '#000', 'stroke-width': 10, 'paint-order': 'stroke' }
            ), { zIndex: 2, visible: false });
            actionHelper.onTextureLoaded(wallObjects[0].texture, () => {
                wallObjects[0].visible = true;
                if (wallObjectsToDestroy[0]) {
                    wallObjectsToDestroy[0].destroy();
                }
            });
        }
    }

    // Floor

    if (!terrainObjects.previousFloor ||
        decorationFloorLandscape !== terrainObjects.decorationFloorLandscape) {
        const floorToDestroy = terrainObjects.previousFloor;
        terrainObjects.previousFloor = {};

        const background = new Graphics();
        let fill = 0x555555;
        if (lighting === 'disabled' || !(app.renderer instanceof PIXI.WebGLRenderer)) {
            fill = 0x202020;
        }
        if (lighting === 'low') {
            fill = 0x353535;
        }
        if (decorationFloorLandscape) {
            fill = parseInt(decorationFloorLandscape.floorBackgroundColor.substring(1), 16);
            fill = colorBrightness(fill, decorationFloorLandscape.floorBackgroundBrightness);
            if (lighting === 'low') {
                fill = multiply(fill, 0.65);
            }
            if (lighting === 'disabled') {
                fill = multiply(fill, 0.5);
            }
        }
        background.beginFill(fill);
        background.drawRect(-HALF_CELL_SIZE, -HALF_CELL_SIZE, VIEW_BOX, VIEW_BOX);
        background.endFill();
        terrainLayer.addChild(background);
        terrainObjects.previousFloor.background = background;

        let ground;
        if (decorationFloorLandscape) {
            if (decorationFloorLandscape.decoration.tileScale) {
                ground = TilingSprite.fromImage(
                    decorationFloorLandscape.decoration.floorForegroundUrl,
                    VIEW_BOX, VIEW_BOX);
                ground.texture.baseTexture.mipmap = false;
                ground.tileScale.x = decorationFloorLandscape.decoration.tileScale;
                ground.tileScale.y = decorationFloorLandscape.decoration.tileScale;
            } else {
                ground = Sprite.fromImage(decorationFloorLandscape.decoration.floorForegroundUrl);
            }
            let tint = colorBrightness(
                parseInt(decorationFloorLandscape.floorForegroundColor.substr(1), 16),
                decorationFloorLandscape.floorForegroundBrightness);
            if (lighting === 'low') {
                tint = multiply(tint, 0.65);
            }
            if (lighting === 'disabled') {
                tint = multiply(tint, 0.5);
            }
            Object.assign(ground, {
                x: -0.5 * CELL_SIZE,
                y: -0.5 * CELL_SIZE,
                width: VIEW_BOX,
                height: VIEW_BOX,
                alpha: decorationFloorLandscape.floorForegroundAlpha,
                tint,
            });
        } else {
            ground = new TilingSprite(stage.resources.ground.texture, VIEW_BOX, VIEW_BOX);
            ground.x = -HALF_CELL_SIZE;
            ground.y = -HALF_CELL_SIZE;
            ground.tileScale.x = 3;
            ground.tileScale.y = 3;
            if (lighting === 'normal') {
                ground.alpha = 0.3;
            } else if (lighting === 'low') {
                ground.alpha = 0.1;
            } else {
                ground.alpha = 0.2;
            }

            const ground2 = new TilingSprite(stage.resources['ground-mask'].texture, VIEW_BOX, VIEW_BOX);
            ground2.x = -HALF_CELL_SIZE;
            ground2.y = -HALF_CELL_SIZE;
            ground2.tileScale.x = 7;
            ground2.tileScale.y = 7;
            ground2.blendMode = BLEND_MODES.MULTIPLY;
            if (lighting === 'normal') {
                ground2.alpha = 0.15;
            } else if (lighting === 'low') {
                ground2.alpha = 0.05;
            } else {
                ground2.alpha = 0.1;
            }
            terrainObjects.previousFloor.ground2 = ground2;
            terrainLayer.addChild(ground2);
        }
        terrainLayer.addChild(ground);
        terrainObjects.previousFloor.ground = ground;

        if (floorToDestroy) {
            floorToDestroy.background.destroy();
            floorToDestroy.ground.destroy();
            if (floorToDestroy.ground2) {
                floorToDestroy.ground2.destroy();
            }
        }
    }

    terrainObjects.decorationFloorLandscape = decorationFloorLandscape;
    terrainObjects.decorationWallLandscape = decorationWallLandscape;
};
