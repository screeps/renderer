/**
 * Created by vedi on 22/08/2017.
 */

import { Container, TextMetrics, TextStyle, Graphics } from 'pixi.js';

import object from './object';
import text from './text';
import actionHelper from '../utils/actionHelper';

const PRIVATE_COLOR = 0xcccccc;
const PUBLIC_COLOR = 0xdd8888;

export default (params) => {
    const {
        payload: { say },
        world: { app: { stage } },
        scope,
    } = params;
    const parsedSay = actionHelper.parseExpression(say, params);

    const backgroundColor = parsedSay.isPublic ? PUBLIC_COLOR : PRIVATE_COLOR;
    const style = {
        align: 'center',
        fill: '#111',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 60,
    };
    const container = object(params, Container);
    scope.sayContainer = container;

    const textMetrics = TextMetrics.measureText(parsedSay.message, new TextStyle(style));

    const bubbleWidth = textMetrics.width + 60;
    const bubbleHeight = 100;
    const bubbleOffset = -170;

    const r = 30;
    const left = -bubbleWidth / 2;
    const right = bubbleWidth / 2;
    const top = bubbleOffset;
    const bottom = bubbleOffset + bubbleHeight;

    const graphics = new Graphics();
    graphics.lineStyle(8, 0x000000);
    graphics.beginFill(backgroundColor);
    graphics.moveTo(left + r, top);
    graphics.lineTo(right - r, top);
    graphics.arc(right - r, top + r, r, -Math.PI / 2, 0);
    graphics.lineTo(right, bottom - r);
    graphics.arc(right - r, bottom - r, r, 0, Math.PI / 2);
    graphics.lineTo(30, bottom);
    graphics.lineTo(0, -44);
    graphics.lineTo(-30, bottom);
    graphics.lineTo(left + r, bottom);
    graphics.arc(left + r, bottom - r, r, Math.PI / 2, Math.PI);
    graphics.lineTo(left, top + r);
    graphics.arc(left + r, top + r, r, Math.PI, Math.PI * 3 / 2);
    graphics.closePath();
    graphics.endFill();
    container.addChild(graphics);

    const textParams = Object.assign({}, params, {
        id: 'sayText',
        payload: {
            parentId: 'sayContainer',
            text: parsedSay.message,
            style,
            x: 0,
            y: bubbleOffset + (bubbleHeight / 2),
            anchor: {
                x: 0.5,
                y: 0.5,
            },
        },
    });
    text(textParams);

    actionHelper.addTickerHandler(container, () =>
        actionHelper.alignPositionToPixels(container, stage));

    return container;
};
