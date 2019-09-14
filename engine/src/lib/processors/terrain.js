/**
 * Created by vedi on 28/09/2017.
 */

import {
    BLEND_MODES, extras, filters, Point, RenderTexture, Sprite, Texture,
    WebGLRenderer,
} from 'pixi.js';

import pathHelper from '../pathHelper';
import actionHelper from '../utils/actionHelper';

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
        svgOptionsStr}><path ${pathOptionsStr} d="${path}" /></svg>`;
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
            layers: { terrain: terrainLayer, lighting: lightingLayer, effects: effectsLayer },
            options: { size: rendererSize },
        },
        state: { gameData: { player, swampTexture = 'animated' }, objects, users = {}, setTerrain },
        world: {
            options: { CELL_SIZE, RENDER_SIZE: size = rendererSize, VIEW_BOX, lighting = 'normal' },
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
            width: 5000,
            height: 5000,
            renderable: false,
        });
        stage.addChild(stage.terrainObjects.wallMask);
    }
    const { terrainObjects } = stage;

    let { previousSwamps } = terrainObjects;
    if (!previousSwamps) {
        previousSwamps = [];
        terrainObjects.previousSwamps = previousSwamps;
    }
    if (setTerrain) {
        previousSwamps = objects.filter(({ type }) => type === 'swamp');
        terrainObjects.previousSwamps = previousSwamps;
    }
    const { result: swampPath, md5: swampMd5 } = pathHelper(
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
            swampObjects[0] = setupObject(
                buildSvg(
                    swampPath,
                    { size, VIEW_BOX },
                    {
                        fill: swampTexture !== 'disabled' ? '#4a501e' : '#465c03',
                        stroke: swampTexture !== 'disabled' ? '#4a501e' : '#3b4019',
                        'stroke-width': 50,
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
                    { fill: '#292b18', stroke: '#252715', 'stroke-width': 50, 'paint-order': 'stroke' }
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
        const { md5: rampartsMd5, result: rampartsPath } = pathHelper(
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
    const { md5, result: wallPath } = pathHelper(objArrays,
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

            const base = buildSvg(
                wallPath,
                { size, VIEW_BOX },
                {
                    fill: lighting === 'disabled' ? '#181818' : '#111',
                    stroke: '#000',
                    'stroke-width': 10,
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
                { fill: '#808080' }), { parentLayer: lightingLayer, visible: false });

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
};
