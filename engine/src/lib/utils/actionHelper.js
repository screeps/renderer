import { ticker, Point } from 'pixi.js';
import actions from '../actions';
import * as EXPRESSIONS from '../expressions';

function createFunc(fn, expressionParamFn, restParamFn) {
    return stateParams => fn(
        expressionParamFn(stateParams),
        restParamFn(stateParams),
        stateParams
    );
}

export default {
    createAction({ action: actionName, params }, stateParams) {
        const Class = actions[actionName];
        const parsedParams = this.parseExpressions(params, stateParams);
        return new Class(...parsedParams);
    },

    parseExpressions(expressions, stateParams) {
        return expressions.map(param => this.parseExpression(param, stateParams));
    },

    parseExpression(expression, stateParams) {
        if (typeof expression === 'function') {
            return expression(stateParams);
        } else if (expression === null || expression === undefined) {
            return expression;
        } else if (Array.isArray(expression)) {
            return this.parseExpressions(expression, stateParams);
        } else {
            const foundKey =
                Object.keys(EXPRESSIONS).find(key => Object.keys(expression).includes(`$${key}`));
            if (foundKey) {
                const { [`$${foundKey}`]: expressionParam, ...rest } = expression;
                return EXPRESSIONS[foundKey](
                    this.parseExpression(expressionParam, stateParams),
                    this.parseExpression(rest, stateParams),
                    stateParams
                );
            } else if (expression.action) {
                return this.createAction(expression, stateParams);
            } else if (typeof expression === 'object') {
                return this.parseObjectValues(expression, stateParams);
            } else {
                return expression;
            }
        }
    },

    parseObjectValues(object, stateParams) {
        const parsed = Object.entries(object).map(([key, value]) =>
            [key, this.parseExpression(value, stateParams)]);
        const result = {};
        parsed.forEach(([key, value]) => {
            result[key] = value;
        });
        return result;
    },

    compileExpressions(expressions) {
        const funcs = expressions.map(param => this.compileExpression(param));
        return stateParams => funcs.map(func => func(stateParams));
    },

    compileExpression(expression) {
        if (expression === null || expression === undefined) {
            return () => expression;
        } else if (Array.isArray(expression)) {
            return this.compileExpressions(expression);
        } else {
            const foundKey =
                Object.keys(EXPRESSIONS).find(key => Object.keys(expression).includes(`$${key}`));
            if (foundKey) {
                const { [`$${foundKey}`]: expressionParam, ...rest } = expression;
                return createFunc(
                    EXPRESSIONS[foundKey],
                    this.compileExpression(expressionParam),
                    this.compileExpression(rest)
                );
            } else if (typeof expression === 'object') {
                return this.compileObjectValues(expression);
            } else {
                return () => expression;
            }
        }
    },

    compileObjectValues(object) {
        const compiled = Object.entries(object).map(([key, value]) =>
            [key, this.compileExpression(value)]);

        const result = {};

        return (stateParams) => {
            compiled.forEach(([key, value]) => {
                result[key] = typeof value === 'function' ? value(stateParams) : value;
            });
            return result;
        };
    },

    addTickerHandler(sprite, fn) {
        function _handler(time) {
            try {
                fn(time);
            } catch (e) {
                ticker.shared.remove(_handler);
            }
        }
        ticker.shared.add(_handler);
        sprite.on('removed', () => ticker.shared.remove(_handler));
    },

    alignPositionToPixels(object, stage) {
        if (!object._position) {
            object._position = new Point(object.x, object.y);
        }
        object.position.copy(object._position);
        const bounds = object.getBounds();
        object.x += (Math.round(bounds.x) - bounds.x) / stage.scale.x;
        object.y += (Math.round(bounds.y) - bounds.y) / stage.scale.y;
    },

    onTextureLoaded(texture, fn) {
        if (texture.baseTexture.hasLoaded) {
            fn();
            return;
        }
        texture.baseTexture.once('loaded', fn);
    },

    enableTextureMipmap(renderer, baseTexture) {
        renderer.bindTexture(baseTexture, false, 0);
        const glTex = baseTexture._glTextures[renderer.CONTEXT_UID];
        glTex.enableMipmap();
        glTex.enableLinearScaling();
    },

    setSvgResizeHandler(app, sprite, resource) {
        if (resource.scaledSvgTextures) {
            const handler = () => {
                let texture = resource.scaledSvgTextures[app.renderer.width];
                if (!texture) {
                    const keys = Object.keys(resource.scaledSvgTextures);
                    texture = resource.scaledSvgTextures[keys[keys.length - 1]];
                }
                this.onTextureLoaded(texture, () => {
                    try {
                        sprite.texture = texture;
                        if (sprite._parsedWidth && sprite._parsedHeight) {
                            sprite.scale.x = sprite._parsedWidth / texture.width;
                            sprite.scale.y = sprite._parsedHeight / texture.height;
                        }
                    } catch (e) {
                        // eslint-disable-next-line no-empty
                    }
                });
            };
            app.renderer.on('_resized', handler);
            sprite.on('removed', () => app.renderer.off('_resized', handler));
            handler();
        }
    },
};
