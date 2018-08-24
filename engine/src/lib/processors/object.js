/**
 * Created by vedi on 29/08/2017.
 */

import { filters } from 'pixi.js';
import actionHelper from '../utils/actionHelper';

const { BlurFilter } = filters;

export default (params, Class, constructorParams = []) => {
    const {
        rootContainer,
        logger,
        id: objectId = 'object',
        payload: {
            id = objectId,
            parentId,
            addToParent = true,
            Class: PayloadClass = Class,
            constructorParams: payloadConstructorParams = constructorParams,
            width,
            height,
            scale: payloadScale,
            shouldCreate = true,
            pivot: payloadPivot,
            anchor: payloadAnchor,
            blur,
            ...objectOptions
        } = {},
        scope,
    } = params;
    const savedObject = scope[id];
    if (savedObject) {
        savedObject.destroy();
        delete scope[id];
    }
    if (!actionHelper.parseExpression(shouldCreate, params)) {
        return;
    }
    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }
    const object = new PayloadClass(...payloadConstructorParams);

    const scale = payloadScale ? { ...payloadScale } : { x: 1, y: 1 };
    const pivot = payloadPivot ? { ...payloadPivot } : {};
    const anchor = payloadAnchor ? { ...payloadAnchor } : {};

    if (width !== undefined) {
        object._parsedWidth = actionHelper.parseExpression(width, params);
        scale.x = object._parsedWidth / object.width;
        // scaling proportional
        if (height === undefined) {
            // noinspection JSSuspiciousNameCombination
            scale.y = scale.x;
            object._parsedHeight = object._parsedWidth;
        }
    }
    if (height !== undefined) {
        object._parsedHeight = actionHelper.parseExpression(height, params);
        scale.y = object._parsedHeight / object.height;
        // scaling proportional
        if (width === undefined) {
            // noinspection JSSuspiciousNameCombination
            scale.x = scale.y;
            object._parsedWidth = object._parsedHeight;
        }
    }
    if (pivot.x !== undefined) {
        pivot.x = actionHelper.parseExpression(pivot.x, params) / scale.x;
    } else if (anchor.x === undefined) {
        anchor.x = 0.5;
    }
    if (pivot.y !== undefined) {
        pivot.y = actionHelper.parseExpression(pivot.y, params) / scale.y;
    } else if (anchor.y === undefined) {
        anchor.y = 0.5;
    }
    Object.assign(object, actionHelper.parseExpression(objectOptions, params));
    Object.assign(object.scale, actionHelper.parseExpression(scale, params));
    if (object.anchor) {
        Object.assign(object.anchor, actionHelper.parseExpression(anchor, params));
    }
    Object.assign(object.pivot, actionHelper.parseExpression(pivot, params));

    if (blur !== undefined) {
        const filter = new BlurFilter(actionHelper.parseExpression(blur, params));
        filter.blendMode = object.blendMode;
        object.filters = [filter];
    }

    if (addToParent) {
        parent.addChild(object);
    }
    scope[id] = object;

    const originalDestroy = object.destroy.bind(object);
    // TODO: Optimize
    object.destroy = () => {
        scope[id] = undefined;
        originalDestroy();
    };

    return object;
};
