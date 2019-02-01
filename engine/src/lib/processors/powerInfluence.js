/**
 * Created by vedi on 19/03/2017.
 */

import { Sprite, Container } from 'pixi.js';
import constants from '@screeps/common/lib/constants';

import { convertGameXYToWorld } from '../../../../helpers/mathHelper';

import { AlphaTo, DelayTime, ScaleTo, Sequence, Spawn } from '../actions';

const INFLUENCE_TEXTURE = {
    [constants.PWR_CORRUPT_SOURCE]: 'corrupt-source',
    [constants.PWR_DISABLE_SPAWN]: 'disable-spawn',
    [constants.PWR_DISABLE_TOWER]: 'disable-tower',
    [constants.PWR_DRAIN_EXTENSION]: 'drain-extension',
    [constants.PWR_EXTEND_MINERAL]: 'extend-mineral',
    [constants.PWR_EXTEND_SOURCE]: 'extend-source',
    [constants.PWR_GENERATE_OPS]: 'generate-ops',
    [constants.PWR_OPERATE_EXTENSION]: 'operate-extension',
    [constants.PWR_OPERATE_LAB]: 'operate-lab',
    [constants.PWR_OPERATE_OBSERVER]: 'operate-observer',
    [constants.PWR_OPERATE_SPAWN]: 'operate-spawn',
    [constants.PWR_OPERATE_STORAGE]: 'operate-storage',
    [constants.PWR_OPERATE_TERMINAL]: 'operate-terminal',
    [constants.PWR_OPERATE_TOWER]: 'operate-tower',
    [constants.PWR_SHIELD]: 'shield',

    [constants.PWR_BERSERK]: 'berserk',
    [constants.PWR_DEFEND]: 'defend',
    [constants.PWR_DISABLE]: 'disable',
    [constants.PWR_ENCOURAGE]: 'encourage',
    [constants.PWR_EXHAUST]: 'exhaust',
    [constants.PWR_RENEW]: 'renew',
    [constants.PWR_SIGHT]: 'sight',
    [constants.PWR_SUMMON]: 'summon',

    [constants.PWR_DEMOLISH]: 'demolish',
    [constants.PWR_HARVEST_ENERGY]: 'harvest-energy',
    [constants.PWR_HARVEST_MINERAL]: 'harvest-mineral',
    [constants.PWR_KILL]: 'kill',
    [constants.PWR_MASS_REPAIR]: 'mass-repair',
    [constants.PWR_PUNCH]: 'punch',
    [constants.PWR_REFLECT]: 'reflect',
    [constants.PWR_REINFORCE]: 'reinforce',
    [constants.PWR_REMOTE_TRANSFER]: 'remote-transfer',
    [constants.PWR_SNIPE]: 'snipe',
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
    const { actionLog: { power } = {} } = state;
    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }
    if (!prevState) {
        return;
    }

    const actionsToApply = [];
    if (power) {
        const textureKey = INFLUENCE_TEXTURE[power.id];
        if (!textureKey) {
            console.log('No texture key provided for power id', power.id);
        }
        const texture = stage.resources[textureKey];
        if (!texture) {
            console.log('No texture provided for key ', textureKey);
        }
        const sprite = createCoverSprite(texture, rootContainer, scope, world);
        actionsToApply.push(createCoverSpriteAction(sprite, tickDuration * 0.9,
            convertGameXYToWorld({ x: power.x, y: power.y }, worldOptions), 0.3));
    }
    applyActions(actionsToApply, stage.actionManager);
};
