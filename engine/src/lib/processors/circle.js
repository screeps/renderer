/**
 * Created by vedi on 19/03/2017.
 */

import draw from './draw';
import actionHelper from '../utils/actionHelper';

export default (params) => {
    const {
        payload: {
            color,
            radius = 25,
            stroke: strokeColor = 0x000000,
            strokeWidth,
            ...payload
        } = {},
        ...otherParams
    } = params;
    const graphics = draw({ payload, ...otherParams });
    if (graphics) {
        if (strokeWidth) {
            graphics.lineStyle(strokeWidth, strokeColor, 1);
        }
        if (color || color === 0) {
            graphics.beginFill(color);
        }
        graphics.drawCircle(0, 0, actionHelper.parseExpression(radius, params));
        if (color || color === 0) {
            graphics.endFill();
        }
    }
    return graphics;
};
