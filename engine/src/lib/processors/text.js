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
    const parsedStyle = actionHelper.parseExpression(stylePayload, params) || {};
    
    // Ensure style has safe default values for PixiJS v7
    const safeStyle = {
        fill: '#ffffff', // Default text color
        fontSize: 12,
        ...parsedStyle
    };
    
    // Validate color properties in the style
    if (safeStyle.fill !== undefined && typeof safeStyle.fill === 'number') {
        safeStyle.fill = Math.min(0xFFFFFF, Math.max(0, Math.floor(safeStyle.fill)));
    }
    if (safeStyle.stroke !== undefined && typeof safeStyle.stroke === 'number') {
        safeStyle.stroke = Math.min(0xFFFFFF, Math.max(0, Math.floor(safeStyle.stroke)));
    }
    
    const { app: { stage } } = world;

    const text = object(
        { world, logger, payload, ...otherParams },
        Text,
        [parsedText, safeStyle]
    );

    // disable scaling, render fonts in their original size
    actionHelper.addTickerHandler(text, () => {
        text.scale.x = 1 / stage.scale.x;
        text.scale.y = 1 / stage.scale.y;
        text.style.fontSize = safeStyle.fontSize * stage.scale.x;
        text.style.strokeThickness = (safeStyle.strokeThickness || 0) * stage.scale.x;
    });

    // match position to round number of pixels to prevent blurry text
    actionHelper.addTickerHandler(text, () =>
        actionHelper.alignPositionToPixels(text, stage));

    return text;
};
