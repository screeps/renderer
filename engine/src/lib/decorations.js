import { Container, Sprite, TilingSprite } from 'pixi.js';
import { AlphaTo, Repeat, Sequence, Spawn } from './actions';

const ANIMATIONS = {
    slow: [
        [0.3, 5.0],
        [1.0, 5.0],
    ],
    fast: [
        [0.3, 1.0],
        [1.0, 1.0],
    ],
    blink: [
        [0.8, 2.0],
        [1.0, 0.1],
        [0.6, 4.0],
        [1.0, 0.1],
        [0.7, 1.0],
        [1.0, 0.1],
    ],
    neon: [
        [1.0, 5.0],
        [0.95, 0.07],
        [1.0, 0.07],
        [1.0, 0.07],
        [0.9, 0.07],
        [1.0, 0.07],
        [0.7, 0.07],
        [1.0, 0.07],
        [1.0, 0.1],
        [0.9, 0.07],
        [1.0, 0.07],
    ],
    flash: [
        [1.0, 0.1],
        [0.0, 1.5],
        [0.0, 2],
    ],
};

// eslint-disable-next-line import/prefer-default-export
export function set(decorations, params) {
    const {
        world,
        world: {
            options: { CELL_SIZE },
            stage: { actionManager },
        },
    } = params;

    world.decorations = decorations;
    if (world.decorationsContainer) {
        world.decorationsContainer.destroy({
            children: true,
            texture: true,
            baseTexture: false,
        });
    }
    world.decorationsContainer = new Container();
    world.stage.addChild(world.decorationsContainer);

    decorations.forEach((decorationItem) => {
        if (decorationItem.decoration.type === 'wallGraffiti') {
            decorationItem.decoration.graphics.forEach((graphic) => {
                if (graphic.visible && !decorationItem[graphic.visible]) {
                    return;
                }

                function _createSprite() {
                    let sprite;
                    if (decorationItem.decoration.tiling) {
                        sprite = TilingSprite.fromImage(graphic.url,
                            decorationItem.width * CELL_SIZE,
                            decorationItem.height * CELL_SIZE);
                        sprite.texture.baseTexture.mipmap = false;
                        sprite.tileScale.x = decorationItem.tileScale;
                        sprite.tileScale.y = decorationItem.tileScale;
                    } else {
                        sprite = Sprite.fromImage(graphic.url);
                    }
                    Object.assign(sprite, {
                        anchor: {
                            x: 0.5,
                            y: 0.5,
                        },
                        x: Math.floor((decorationItem.x + (-0.5) + (decorationItem.width / 2))
                            * CELL_SIZE),
                        y: Math.floor((decorationItem.y + (-0.5) + (decorationItem.height / 2))
                            * CELL_SIZE),
                        width: decorationItem.width * CELL_SIZE,
                        height: decorationItem.height * CELL_SIZE,
                        mask: world.stage.terrainObjects.wallMask,
                        zIndex: 2,
                    });
                    if (decorationItem.flip) {
                        sprite.scale.x *= -1;
                    }
                    if (decorationItem.rotation) {
                        sprite.rotation = decorationItem.rotation;
                    }
                    if (decorationItem.animation) {
                        const action = new Repeat(new Sequence(
                            ANIMATIONS[decorationItem.animation].map(step => new Spawn([
                                new AlphaTo(step[0], step[1]),
                            ]))));
                        actionManager.runAction(sprite, action);
                    }
                    return sprite;
                }

                const container = new Container();
                world.decorationsContainer.addChild(container);
                if (decorationItem.alpha) {
                    container.alpha = decorationItem.alpha;
                }

                const mainSprite = _createSprite();
                mainSprite.parentLayer = world.layers.wallGraffiti;
                mainSprite.tint = parseInt(decorationItem[graphic.color].substr(1), 16);
                container.addChild(mainSprite);

                if (decorationItem.decoration.lighting) {
                    const lightingSprite = _createSprite();
                    lightingSprite.parentLayer = world.layers.lighting;
                    container.addChild(lightingSprite);
                }
            });
        }

        if (decorationItem.decoration.type === 'wallLandscape') {
            const sprite = Sprite.fromImage(decorationItem.decoration.foregroundUrl);
            Object.assign(sprite, {
                x: 0,
                y: 0,
                width: 50 * CELL_SIZE,
                height: 50 * CELL_SIZE,
                parentLayer: world.layers.wallGraffiti,
                alpha: decorationItem.alphaForeground,
                tint: parseInt(decorationItem.colorForeground.substr(1), 16),
                mask: world.stage.terrainObjects.wallMask,
                zIndex: 1,
            });
            world.decorationsContainer.addChild(sprite);
        }
    });
}
