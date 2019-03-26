/**
 * Created by vedi on 19/03/2017.
 */

import _ from 'lodash';
import { Sprite } from 'pixi.js';
import actionHelper from '../utils/actionHelper';

import container from './container';
import object from './object';


/**
 * @param params
 * @param params.payload
 * @param params.payload.key='sprite'
 * @param params.payload.width=100
 * @param params.payload.height=100
 * @param params.payload.color=0xffffff
 * @param params.payload.x
 * @param params.payload.y
 * @param params.payload.pivot
 * @param params.payload.pivot.x
 * @param params.payload.pivot.y
 * @param params.payload.texture=objectTexture
 * @returns {*}
 */
export default (params) => {
    const {
        logger,
        rootContainer,
        scope,
        world,
        objectMetadata: { texture: objectTexture },
        payload: {
            parentId,
            texture = objectTexture,
            ...payload
        } = {},
        stage: { resourceManager },
        ...otherParams
    } = params;

    if (!texture) {
        logger.warn('texture is not provided');
        return;
    }
    let resource;
    const parsedTexture = actionHelper.parseExpression(texture, params);
    if (_.isString(parsedTexture)) {
        resource = resourceManager.getCachedResource(parsedTexture);
    } else {
        resource = texture;
        if (!resource) {
            logger.warn('Cannot find resource', texture);
            return;
        }
    }

    if (resource) {
        const obj = object(
            {
                logger,
                payload: { ...payload, parentId },
                rootContainer,
                scope,
                ...otherParams,
            },
            Sprite,
            [resource.texture]
        );
        actionHelper.setSvgResizeHandler(world, obj, resource);
        return obj;
    } else {
        // wrapping to container
        const result = container(
            {
                logger,
                payload: { parentId },
                rootContainer,
                scope,
                ...otherParams,
            }
        );
        resourceManager
            .getResource(texture)
            .then((loadedResource) => {
                const obj = object(
                    {
                        logger,
                        payload: { ...payload, addToParent: false },
                        rootContainer,
                        scope: {},
                        ...otherParams,
                    },
                    Sprite,
                    [loadedResource.texture]
                );
                actionHelper.setSvgResizeHandler(world, obj, loadedResource);
                obj.zIndex = -1000;
                result.addChild(obj);
            });
        return result;
    }
};
