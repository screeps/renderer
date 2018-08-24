/**
 * Created by vedi on 22/08/2017.
 */

import { Graphics } from 'pixi.js';

import object from './object';
import actionHelper from '../utils/actionHelper';

export default (params) => {
    const {
        logger,
        payload: { drawings = [], ...payload } = {},
        ...otherParams
    } = params;
    const gameObject = object(
        Object.assign(params, { logger, payload, ...otherParams }), Graphics);
    if (gameObject) {
        drawings.forEach(({ method: methodName, params: drawingParams = [] }) => {
            const parsedParams = actionHelper.parseExpressions(drawingParams, params);
            const method = gameObject[methodName];
            if (!method) {
                logger.warn('Cannot resolve drawing method', methodName);
            }
            method.call(gameObject, ...parsedParams);
        });
    }
    return gameObject;
};
