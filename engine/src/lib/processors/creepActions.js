/**
 * Created by vedi on 19/03/2017.
 */

import { Graphics, Sprite, filters, BLEND_MODES, Container, WebGLRenderer } from 'pixi.js';
import { calculateAngle, convertGameXYToWorld } from '../../../../helpers/mathHelper';

import { AlphaTo, CallFunc, MoveBy, RotateTo, Sequence, DelayTime } from '../actions';

const { BlurFilter } = filters;

const TWEEN_DURATION = 0.6;

const COLORS = {
    default: 0xffe533,
    attack: 0xFF3333,
    attackAndHeal: 0xFFFF33,
    heal: 0x2ce328,
    power: 0xCC3D3E,
    rangedAttack: 0x3c75c7,
    reserveController: 0xb99cfb,
    attackController: 0xb99cfb,
    runReaction: 0xffffff,
    transferEnergy: 0xffe533,
};

function createCoverSprite(resources, rootContainer, scope, world) {
    const container = new Container();
    container.position.copy(rootContainer.position);
    container.alpha = 0;
    rootContainer.parent.addChild(container);
    scope.coverSprite = container;

    // we need to remove it manually because it is added to the parent
    rootContainer.on('removed', () => container.destroy());

    const cover = new Sprite(resources.cover.texture);
    // coverSprite.blendMode = BLEND_MODES.ADD;
    // coverSprite.width = 150;
    // coverSprite.height = 150;
    cover.anchor.x = 0.5;
    cover.anchor.y = 0.5;
    cover.alpha = 0.3;
    // cover.filters = [new BlurFilter(1)];
    cover.parentLayer = world.layers.effects;
    container.addChild(cover);

    const flare = new Sprite(resources.flare2.texture);
    flare.blendMode = BLEND_MODES.ADD;
    flare.width = 300;
    flare.height = 300;
    flare.anchor.x = 0.5;
    flare.anchor.y = 0.5;
    flare.alpha = 0.05;
    flare.parentLayer = world.layers.effects;
    container.addChild(flare);

    const coverLighting = new Sprite(resources.glow.texture);
    coverLighting.anchor.x = 0.5;
    coverLighting.anchor.y = 0.5;
    coverLighting.x = 0;
    coverLighting.y = 0;
    coverLighting.width = 500;
    coverLighting.height = 500;
    coverLighting.alpha = 0.5;
    coverLighting.parentLayer = world.layers.lighting;
    container.addChild(coverLighting);
}

function createChildCoverSprite(resources, parent, scope, world) {
    const sprite = new Sprite(resources.cover.texture);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.alpha = 0;
    sprite.parentLayer = world.layers.effects;
    sprite.blendMode = BLEND_MODES.ADD;
    parent.addChild(sprite);
    scope.childCoverSprite = sprite;
}

function applyActions(actionsToApply, actionManager) {
    actionsToApply.forEach(({ target, action }) => actionManager.runAction(target, action));
    // TODO: Cancel all previous actions
}

function interp(from, to, d) {
    return from + ((to - from) * d);
}

function getDrawShotFunc(totalDuration, lineWidth, color, fx, fy, tx, ty) {
    return (graphics, restTime, deltaMS) => {
        const newRestTime = restTime - deltaMS;
        if (newRestTime <= 0) {
            graphics.destroy(true);
            return;
        }
        let v = newRestTime / (1000 * totalDuration);
        graphics.clear();
        graphics.lineStyle(lineWidth, color, 1);
        if (v < 0.5) {
            v *= 2;
            graphics.moveTo(fx, fy);
            graphics.lineTo(interp(fx, tx, v), interp(fy, ty, v));
        } else {
            v = (v - 0.5) * 2;
            graphics.moveTo(fx + ((tx - fx) * v), fy + ((ty - fy) * v));
            graphics.lineTo(tx, ty);
        }
    };
}

function createBiteAction(
    actionsToApply, rootContainer, scope, state, biteTarget, tickDuration, worldOptions) {
    if (state.x === biteTarget.x && state.y === biteTarget.y) {
        return;
    }

    const { ATTACK_PENETRATION } = worldOptions;
    const { x: targetX, y: targetY } = convertGameXYToWorld(biteTarget, worldOptions);
    const { x, y } = convertGameXYToWorld(state, worldOptions);

    // immediately put to right position
    rootContainer.x = x;
    rootContainer.y = y;


    const dX = targetX - x;
    const dY = targetY - y;

    const byX = dX !== 0 ? ((dX / Math.abs(dX)) * ATTACK_PENETRATION) : 0;
    const byY = dY !== 0 ? ((dY / Math.abs(dY)) * ATTACK_PENETRATION) : 0;

    if (scope.mainContainer) {
        actionsToApply.push({
            action: new RotateTo(
                calculateAngle(rootContainer.x, rootContainer.y, targetX, targetY),
                Math.max(tickDuration / 5, 0.4)),
            target: scope.mainContainer,
        });
    }
    actionsToApply.push({
        action: new Sequence([
            new MoveBy(byX, byY, (1 * tickDuration) / 4),
            new MoveBy(-byX, -byY, (3 * tickDuration) / 4),
        ]),
        target: rootContainer,
    });
}

function createCoverSpriteAction(scope, tint, tickDuration, pos, delay = 0) {
    const action = new Sequence([
        new DelayTime(delay),
        new AlphaTo(1.0, (tickDuration - delay) / 4),
        new AlphaTo(0, (3 * (tickDuration - delay)) / 4),
    ]);
    scope.coverSprite.children[0].tint = tint;
    scope.coverSprite.children[1].tint = tint;
    if (pos) {
        scope.coverSprite.position.copy(pos);
    }
    return { action, target: scope.coverSprite };
}

function createChildCoverSpriteAction(scope, tint, tickDuration, delay = 0) {
    const action = new Sequence([
        new DelayTime(delay),
        new AlphaTo(0.5, (tickDuration - delay) / 4),
        new AlphaTo(0, (3 * (tickDuration - delay)) / 4),
    ]);
    scope.childCoverSprite.tint = tint;
    return { action, target: scope.childCoverSprite };
}

function createRangedShotAction(
    stage, world, fromObject, toObject, tickDuration, worldOptions, color,
    lineWidth = 12, blur, partInTick = TWEEN_DURATION) {
    const duration = partInTick * tickDuration;
    const rangedAttackObject = new Graphics();
    rangedAttackObject.x = fromObject.x;
    rangedAttackObject.y = fromObject.y;
    const { x, y } = convertGameXYToWorld(toObject, worldOptions);
    const fx = x - rangedAttackObject.x;
    const fy = y - rangedAttackObject.y;
    const tx = 0;
    const ty = 0;

    if (blur) {
        rangedAttackObject.filters = [new BlurFilter(blur)];
        rangedAttackObject.alpha = 0.7;
    }
    if (world.app.renderer instanceof WebGLRenderer) {
        rangedAttackObject.blendMode = BLEND_MODES.ADD;
    }
    rangedAttackObject.parentLayer = world.layers.effects;
    stage.addChild(rangedAttackObject);
    const action = new CallFunc(getDrawShotFunc(duration, lineWidth, color, fx, fy, tx, ty),
        duration);
    return { action, target: rangedAttackObject };
}

function pushRangedShotActionWithBlur(
    actionsArray, stage, world, fromObject, toObject, tickDuration, worldOptions, color,
    lineWidth, blur, partInTick) {
    actionsArray.push(createRangedShotAction(stage, world, fromObject, toObject, tickDuration,
        worldOptions, color, lineWidth, undefined, partInTick));
    actionsArray.push(createRangedShotAction(stage, world, fromObject, toObject, tickDuration,
        worldOptions, color, lineWidth, blur, partInTick));
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
    const { actionLog: {
        attacked = null,
        attack = null,
        build = null,
        harvest = null,
        heal = null,
        healed = null,
        power = null,
        rangedAttack = null,
        rangedHeal = null,
        repair = null,
        reserveController = null,
        runReaction = null,
        reverseReaction = null,
        transferEnergy = null,
        upgradeController = null,
    } = {} } = state;
    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }
    if (!prevState) {
        return;
    }
    if (!scope.coverSprite) {
        createCoverSprite(stage.resources, rootContainer, scope, world);
    }
    if (!scope.childCoverSprite) {
        createChildCoverSprite(stage.resources, parent, scope, world);
    }

    const actionsToApply = [];
    const posChanged = prevState && (state.x !== prevState.x || state.y !== prevState.y);
    if (attack) {
        if (state.type === 'tower') {
            pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer,
                attack, tickDuration, worldOptions, COLORS.rangedAttack, 18, 5);
        } else if (!posChanged) {
            createBiteAction(actionsToApply, rootContainer, scope, state, attack, tickDuration,
                worldOptions);
        }
    }
    if (harvest) {
        if (!posChanged) {
            createBiteAction(actionsToApply, rootContainer, scope, state, harvest, tickDuration,
                worldOptions);
        }

        actionsToApply.push(createCoverSpriteAction(scope, COLORS.default, tickDuration * 0.9,
            convertGameXYToWorld(harvest, worldOptions)));
    }
    if (reserveController) {
        if (state.type === 'invaderCore') {
            pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer,
                reserveController, tickDuration, worldOptions, COLORS.reserveController, 18, 5);
        } else if (!posChanged) {
            createBiteAction(actionsToApply, rootContainer, scope, state, reserveController,
                tickDuration, worldOptions);
        }

        actionsToApply.push(createCoverSpriteAction(scope, COLORS.reserveController,
            tickDuration * 0.9, convertGameXYToWorld(reserveController, worldOptions),
            state.type === 'invaderCore' ? tickDuration * 0.3 : 0));
    }
    if (heal) {
        if (state.type === 'tower') {
            pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, heal,
                tickDuration, worldOptions, COLORS.heal, 18, 5);
        } else if (!posChanged) {
            createBiteAction(actionsToApply, rootContainer, scope, state, heal, tickDuration,
                worldOptions);
        }
    }
    if (attacked && healed) {
        actionsToApply.push(createChildCoverSpriteAction(scope, COLORS.attackAndHeal,
            tickDuration * 0.9));
    } else if (healed) {
        actionsToApply.push(createChildCoverSpriteAction(scope, COLORS.heal, tickDuration * 0.9));
    } else if (attacked) {
        actionsToApply.push(createChildCoverSpriteAction(scope, COLORS.attack, tickDuration * 0.9));
    }
    if (rangedAttack) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, rangedAttack,
            tickDuration, worldOptions, COLORS.rangedAttack, 12, 5);
    }
    if (transferEnergy) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, transferEnergy,
            tickDuration, worldOptions, COLORS.transferEnergy, 18, 5);
    }
    if (rangedHeal) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, rangedHeal,
            tickDuration, worldOptions, COLORS.heal, 12, 5);
    }
    if (power) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, power,
            tickDuration, worldOptions, COLORS.power, 12, 5, 0.3);
    }
    if (build) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, build,
            tickDuration, worldOptions, COLORS.default, state.type === 'invaderCore' ? 18 : 12, 5);

        actionsToApply.push(createCoverSpriteAction(scope, COLORS.default, tickDuration * 0.9,
            convertGameXYToWorld(build, worldOptions), tickDuration * 0.3));
    }
    if (upgradeController) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer,
            upgradeController, tickDuration, worldOptions, COLORS.default, state.type === 'invaderCore' ? 18 : 12, 5);

        actionsToApply.push(createCoverSpriteAction(scope, COLORS.default,
            tickDuration * 0.9, convertGameXYToWorld(upgradeController, worldOptions),
            tickDuration * 0.3));
    }
    if (repair) {
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer, repair,
            tickDuration, worldOptions, COLORS.default, state.type === 'tower' ? 18 : 12, 5);

        actionsToApply.push(createCoverSpriteAction(scope, COLORS.default,
            tickDuration * 0.9, convertGameXYToWorld(repair, worldOptions), tickDuration * 0.3));
    }
    if (runReaction) {
        const { x1, y1, x2, y2 } = runReaction;
        pushRangedShotActionWithBlur(actionsToApply, stage, world,
            convertGameXYToWorld({ x: x1, y: y1 }, worldOptions),
            state, tickDuration, worldOptions, COLORS.runReaction, 12, 2);
        pushRangedShotActionWithBlur(actionsToApply, stage, world,
            convertGameXYToWorld({ x: x2, y: y2 }, worldOptions),
            state, tickDuration, worldOptions, COLORS.runReaction, 12, 2);
    }
    if (reverseReaction) {
        const { x1, y1, x2, y2 } = reverseReaction;
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer,
            { x: x1, y: y1 },
            tickDuration, worldOptions, COLORS.runReaction, 12, 2);
        pushRangedShotActionWithBlur(actionsToApply, stage, world, rootContainer,
            { x: x2, y: y2 },
            tickDuration, worldOptions, COLORS.runReaction, 12, 2);
    }

    applyActions(actionsToApply, stage.actionManager);
};
