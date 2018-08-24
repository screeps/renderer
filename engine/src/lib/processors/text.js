/**
 * Created by vedi on 22/08/2017.
 */

import { Text } from 'pixi.js';

import object from './object';
import actionHelper from '../utils/actionHelper';

export default (params) => {
    const {
        world,
        logger,
        payload: { text: textPayload = '?', style: stylePayload, ...payload } = {},
        ...otherParams
    } = params;
    const parsedText = actionHelper.parseExpression(textPayload, params);
    const parsedStyle = actionHelper.parseExpression(stylePayload, params);
    const { app: { stage } } = world;

    const text = object(
        { world, logger, payload, ...otherParams },
        Text,
        [parsedText, parsedStyle]
    );

    // disable scaling, render fonts in their original size
    actionHelper.addTickerHandler(text, () => {
        text.scale.x = 1 / stage.scale.x;
        text.scale.y = 1 / stage.scale.y;
        text.style.fontSize = parsedStyle.fontSize * stage.scale.x;
        text.style.strokeThickness = (parsedStyle.strokeThickness || 0) * stage.scale.x;
    });

    // match position to round number of pixels to prevent blurry text
    actionHelper.addTickerHandler(text, () =>
        actionHelper.alignPositionToPixels(text, stage));

    return text;
};
