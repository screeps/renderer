import { Sprite, Container } from 'pixi.js';
import { AlphaTo, Spawn, Repeat, Sequence, RotateBy, ScaleTo } from '../actions';

export default (params) => {
    const {
        logger,
        stage: { actionManager },
        rootContainer,
        scope,
        state,
        payload: {
            parentId,
        } = {},
        world: {
            decorations = [],
            layers,
        },
    } = params;
    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }

    decorations.forEach((i) => {
        const container = new Container();
        if (i.decoration.syncRotate) {
            parent.addChild(container);
        } else {
            rootContainer.addChildAt(container, 0);
        }

        if (i.decoration.type !== 'creep' || state.user !== `${i.user}` || !(new RegExp(i.nameRegex).test(state.name))) {
            return;
        }

        const sprite = Sprite.fromImage(i.decoration.url);
        Object.assign(sprite, {
            blendMode: i.decoration.blendMode,
            width: i.decoration.width,
            height: i.decoration.height,
            anchor: { x: 0.5, y: 0.5 },
            parentLayer: i.decoration.position === 'below' ? layers.objects : layers.effects,
            zIndex: 1,
        });
        if (i.alpha) {
            sprite.alpha = i.alpha;
        }
        if (i.color) {
            sprite.tint = parseInt(i.color.substring(1), 16);
        }
        container.addChild(sprite);

        if (i.decoration.blendMode === 1) {
            const lighting = Sprite.fromImage(i.decoration.url);
            Object.assign(lighting, {
                blendMode: i.decoration.blendMode,
                width: i.decoration.width,
                height: i.decoration.height,
                anchor: { x: 0.5, y: 0.5 },
                parentLayer: layers.lighting,
            });
            container.addChild(lighting);
        }
        if (i.decoration.alpha) {
            container.alpha = i.decoration.alpha;
        }
        if (i.decoration.animate) {
            const action = new Repeat(new Sequence(i.decoration.animate.map(step => new Spawn([
                new RotateBy(step.rotate, step.duration),
                new AlphaTo(step.alpha, step.duration),
                new ScaleTo(step.scale, step.scale, step.duration),
            ]))));
            actionManager.runAction(container, action);
        }
    });
};
