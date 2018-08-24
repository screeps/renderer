/**
 * Created by vedi on 19/03/2017.
 */

import { Sprite, Container } from 'pixi.js';
import { convertGameXYToWorld } from '../mathHelper';

import { AlphaTo, DelayTime, ScaleTo, Sequence, Spawn } from '../actions';

const INFLUENCE_TEXTURE = {
    CORRUPT_SOURCE: 'corrupt-source',
    DISABLE_SPAWN: 'disable-spawn',
    DISABLE_TOWER: 'disable-tower',
    DRAIN_EXTENSION: 'drain-extension',
    EXTEND_MINERAL: 'extend-mineral',
    EXTEND_SOURCE: 'extend-source',
    GENERATE_OPS: 'generate-ops',
    OPERATE_EXTENSION: 'operate-extension',
    OPERATE_LAB: 'operate-lab',
    OPERATE_OBSERVER: 'operate-observer',
    OPERATE_SPAWN: 'operate-spawn',
    OPERATE_STORAGE: 'operate-storage',
    OPERATE_TERMINAL: 'operate-terminal',
    OPERATE_TOWER: 'operate-tower',
    SHIELD: 'shield',

    BERSERK: 'berserk',
    DEFEND: 'defend',
    DISABLE: 'disable',
    ENCOURAGE: 'encourage',
    EXHAUST: 'exhaust',
    RENEW: 'renew',
    SIGHT: 'sight',
    SUMMON: 'summon',

    DEMOLISH: 'demolish',
    HARVEST_ENERGY: 'harvest-energy',
    HARVEST_MINERAL: 'harvest-mineral',
    KILL: 'kill',
    MASS_REPAIR: 'mass-repair',
    PUNCH: 'punch',
    REFLECT: 'reflect',
    REINFORCE: 'reinforce',
    REMOTE_TRANSFER: 'remote-transfer',
    SNIPE: 'snipe',
};

function createCoverSprite(texture, rootContainer, scope, world) {
    const container = new Container();
    container.position.copy(rootContainer.position);
    rootContainer.parent.addChild(container);

    // we need to remove it manually because it is added to the parent
    rootContainer.on('removed', () => container.destroy());

    const cover = new Sprite(texture.texture);
    cover.anchor.x = 0.5;
    cover.anchor.y = 0.5;
    cover.width = 300;
    cover.height = 300;
    cover.parentLayer = world.layers.effects;
    container.addChild(cover);
    return container;
}

function applyActions(actionsToApply, actionManager) {
    actionsToApply.forEach(({ target, action }) => actionManager.runAction(target, action));
}

function createCoverSpriteAction(sprite, tickDuration, pos, delay = 0) {
    const phaseDuration = (tickDuration - delay) / 4;
    const action = new Sequence([
        new Spawn([
            new ScaleTo(0.5, 0.5, 0),
            new AlphaTo(0, 0),
        ]),
        new DelayTime(delay),
        new Spawn([
            new ScaleTo(1, 1, phaseDuration),
            new AlphaTo(1, phaseDuration),
        ]),
        new AlphaTo(0, phaseDuration),
    ]);
    if (pos) {
        sprite.position.copy(pos);
    }
    return { action, target: sprite };
}

export default (params) => {
    const {
        logger,
        stage,
        rootContainer,
        scope,
        tickDuration,
        state,
        prevState,
        world,
        payload: {
            parentId,
        } = {},
        world: {
            options: worldOptions,
        },
    } = params;
    const { actionLog: { power: { id: powerId, x, y } = {} } = {} } = state;
    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }
    if (!prevState) {
        return;
    }

    const actionsToApply = [];
    if (powerId) {
        const textureKey = INFLUENCE_TEXTURE[powerId];
        if (!textureKey) {
            console.log('No texture key provided for power id', powerId);
        }
        const texture = stage.resources[textureKey];
        if (!texture) {
            console.log('No texture provided for key ', textureKey);
        }
        const sprite = createCoverSprite(texture, rootContainer, scope, world);
        actionsToApply.push(createCoverSpriteAction(sprite, tickDuration * 0.9,
            convertGameXYToWorld({ x, y }, worldOptions), 0.3));
    }
    applyActions(actionsToApply, stage.actionManager);
};
