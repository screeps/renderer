/**
 * Created by vedi on 19/03/2017.
 */

import draw from './draw';
import actionHelper from '../utils/actionHelper';

function getStartPositionArc(angle, radius) {
    return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
    };
}

export default (params) => {
    const {
        rootContainer,
        scope,
        payload,
        ...otherParams
    } = params;

    const progress = actionHelper.parseExpression(payload.progress, params);

    if (progress !== scope.oldProgress) {
        scope.oldProgress = progress;

        const graphics = draw({ rootContainer, scope, ...otherParams });
        const progressTotal = actionHelper.parseExpression(payload.progressTotal, params);
        const color = actionHelper.parseExpression(payload.color, params);
        const radius = actionHelper.parseExpression(payload.radius, params);
        const lineWidth = actionHelper.parseExpression(payload.lineWidth, params);
        graphics.rotation = -Math.PI / 2;
        graphics.beginFill(0x000000, 0.0);
        graphics.lineStyle(lineWidth, color, 1);
        graphics.drawCircle(0, 0, radius + (lineWidth / 2));

        if (progress > 0 && progressTotal > 0) {
            const angle = 2 * Math.PI * (Math.min(progress, progressTotal) / progressTotal);
            graphics.beginFill(color);
            graphics.moveTo(0, 0);
            graphics.lineStyle(1, color, 1);
            const arcStartingPoint = getStartPositionArc(0, radius);
            graphics.lineTo(arcStartingPoint.x, arcStartingPoint.y);
            graphics.arc(0, 0, radius, 0, angle);
            graphics.lineTo(0, 0);
            graphics.endFill();
        }

        return graphics;
    }
};
