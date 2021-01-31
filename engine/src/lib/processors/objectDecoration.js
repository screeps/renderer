import { Sprite, Container } from 'pixi.js';
import { AlphaTo, Spawn, Repeat, Sequence } from '../actions';
import { ANIMATIONS } from '../decorations';
import { colorBrightness } from '../utils/hsl';

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
        if (i.decoration.type !== 'object' || state.user !== `${i.user}` ||
            i.decoration.objectType !== state.type) {
            return;
        }

        const container = new Container();
        rootContainer.addChildAt(container, 0);

        i.decoration.graphics.forEach((graphic) => {
            const sprite = Sprite.fromImage(graphic.url);
            Object.assign(sprite, {
                // blendMode: i.lighting ? 1 : 0,
                width: i.width,
                height: i.height,
                anchor: { x: 0.5, y: 0.5 },
                parentLayer: layers.objects,
                zIndex: 1,
            });
            if (i[graphic.alpha] !== undefined) {
                sprite.alpha = i[graphic.alpha];
            }
            if (i[graphic.color]) {
                sprite.tint = colorBrightness(parseInt(i[graphic.color].substring(1), 16),
                    i.brightness);
            }
            container.addChild(sprite);
        });

        if (i.lighting) {
            i.decoration.graphics.forEach((graphic) => {
                const lighting = Sprite.fromImage(graphic.url);
                Object.assign(lighting, {
                    width: i.width,
                    height: i.height,
                    anchor: { x: 0.5, y: 0.5 },
                    parentLayer: layers.lighting,
                });
                if (i[graphic.alpha] !== undefined) {
                    lighting.alpha = i[graphic.alpha];
                }
                container.addChild(lighting);
            });
        }
        if (i.animation) {
            const action = new Repeat(new Sequence(
                ANIMATIONS[i.animation].map(step => new Spawn([
                    new AlphaTo(step[0], step[1]),
                ]))));
            actionManager.runAction(container, action);
        }
    });
};
