/**
 * Created by vedi on 18/03/2017.
 */

import _all from './objects/_all.metadata';
import constructedWall from './objects/constructedWall.metadata';
import constructionSite from './objects/constructionSite.metadata';
import container from './objects/container.metadata';
import controller from './objects/controller.metadata';
import creep from './objects/creep.metadata';
import deposit from './objects/deposit.metadata';
import energy from './objects/energy.metadata';
import extension from './objects/extension.metadata';
import extractor from './objects/extractor.metadata';
import factory from './objects/factory.metadata';
import flag from './objects/flag.metadata';
import keeperLair from './objects/keeperLair.metadata';
import lab from './objects/lab.metadata';
import link from './objects/link.metadata';
import mineral from './objects/mineral.metadata';
import nuke from './objects/nuke.metadata';
import nuker from './objects/nuker.metadata';
import observer from './objects/observer.metadata';
import portal from './objects/portal.metadata';
import powerBank from './objects/powerBank.metadata';
import powerCreep from './objects/powerCreep.metadata';
import powerSpawn from './objects/powerSpawn.metadata';
import rampart from './objects/rampart.metadata';
import road from './objects/road.metadata';
import source from './objects/source.metadata';
import spawn from './objects/spawn.metadata';
import storage from './objects/storage.metadata';
// import tbd from './objects/tbd.metadata';
import terminal from './objects/terminal.metadata';
import tombstone from './objects/tombstone.metadata';
import tower from './objects/tower.metadata';
import invaderCore from './objects/invaderCore.metadata';
import ruin from './objects/ruin.metadata';

const { VoidFilter } = PIXI.filters;
const { TilingSprite } = PIXI.extras;
const { Graphics, BLEND_MODES } = PIXI;

export default {
    preprocessors: [
        // 'setBadgeUrls',
        'terrain',
    ],
    layers: [
        {
            id: 'terrain',
            afterCreate: async (layer, { app, resourceManager,
                world: { options: { VIEW_BOX, CELL_SIZE,
                    lighting = 'normal' } } }) => {
                function setupExits(textureName, tileX, tileY, flipX, flipY) {
                    const { texture } = resourceManager.getCachedResource(textureName);
                    const sprite = new TilingSprite(texture,
                        tileX ? VIEW_BOX : CELL_SIZE,
                        tileY ? VIEW_BOX : CELL_SIZE);
                    sprite.x = (-CELL_SIZE / 2) + (flipX ? VIEW_BOX - CELL_SIZE : 0);
                    sprite.y = (-CELL_SIZE / 2) + (flipY ? VIEW_BOX - CELL_SIZE : 0);
                    sprite.tileScale.x = CELL_SIZE / texture.width;
                    sprite.tileScale.y = CELL_SIZE / texture.height;
                    if (!(app.renderer instanceof PIXI.WebGLRenderer)) {
                        sprite.tint = 0xa0a0a0;
                    } else {
                        if (lighting === 'disabled') {
                            sprite.tint = 0xa0a0a0;
                        }
                        if (lighting === 'low') {
                            sprite.tint = 0xc0c0c0;
                        }
                    }
                    sprite.blendMode = BLEND_MODES.ADD;
                    sprite.alpha = 0.5;
                    sprite.zIndex = 1;
                    layer.addChild(sprite);
                }

                setupExits('exit-left', false, true, false, false);
                setupExits('exit-bottom', true, false, false, true);
                setupExits('exit-top', true, false, false, false);
                setupExits('exit-right', false, true, true, false);
            },
        },
        { id: 'wallGraffiti' },
        { id: 'objects', isDefault: true },
        {
            id: 'lighting',
            afterCreate: async (layer, { app, world: { options: { CELL_SIZE,
                HALF_CELL_SIZE = CELL_SIZE / 2, VIEW_BOX, lighting = 'normal' } } }) => {
                if (lighting !== 'disabled' && app.renderer instanceof PIXI.WebGLRenderer) {
                    layer.filters = [new VoidFilter()];
                    layer.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;

                    const ambient = new PIXI.Graphics();
                    ambient.beginFill(0x808080, 1.0);
                    ambient.drawRect(-HALF_CELL_SIZE, -HALF_CELL_SIZE, VIEW_BOX, VIEW_BOX);
                    ambient.endFill();
                    layer.addChild(ambient);

                    if (lighting === 'low') {
                        layer.alpha = 0.5;
                    }

                    layer.on('display', (element) => {
                        if (!element._overrideBlendMode) {
                            element.blendMode = PIXI.BLEND_MODES.SCREEN;
                        }
                    });
                } else {
                    layer.on('display', (element) => {
                        element.visible = false;
                    });
                }
            },
        },
        { id: 'effects' },
    ],
    objects: {
        _all,
        constructedWall,
        constructionSite,
        container,
        controller,
        creep,
        deposit,
        energy,
        extension,
        extractor,
        factory,
        flag,
        keeperLair,
        lab,
        link,
        mineral,
        nuke,
        nuker,
        observer,
        portal,
        powerBank,
        powerCreep,
        powerSpawn,
        road,
        source,
        spawn,
        storage,
        terminal,
        tombstone,
        tower,
        rampart,
        invaderCore,
        ruin
    },
};
