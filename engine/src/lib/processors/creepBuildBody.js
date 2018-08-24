/**
 * Created by vedi on 19/03/2017.
 */

import { Graphics, Sprite } from 'pixi.js';

const maxParts = 50;
const ANGLE_SHIFT = -Math.PI / 2;
const PART_ANGLE = (2 * Math.PI) / maxParts / 2;
const MAX_PART_HITS = 100.0;
const RADIUS = 50;
const LINE_WIDTH = 18;
const BODY_PARTS = {
    move: {
        color: 0xaab7c5,
        order: 0,
        backSide: true,
    },
    work: {
        color: 0xfde574,
        order: 1,
    },
    carry: {
        color: 0x666666,
        order: 6,
    },
    attack: {
        color: 0xf72e41,
        order: 2,
    },
    ranged_attack: {
        color: 0x7fa7e5,
        order: 3,
    },
    heal: {
        color: 0x56cf5e,
        order: 4,
    },
    claim: {
        color: 0xb99cfb,
        order: 5,
    },
};

function createBodyPartSprite(color, startAngle, endAngle, parent, bodySprites, anticlockwise) {
    const bodyPartBarSprite = new Graphics();
    bodyPartBarSprite.lineStyle(LINE_WIDTH, color, 1);
    bodyPartBarSprite.arc(
        0,
        0,
        RADIUS - (LINE_WIDTH / 2),
        ANGLE_SHIFT + startAngle,
        ANGLE_SHIFT + endAngle,
        anticlockwise
    );
    bodyPartBarSprite.tint = color;
    parent.addChild(bodyPartBarSprite);
    bodySprites.push(bodyPartBarSprite);
    return bodyPartBarSprite;
}

function createToughSprite(resources, parent, bodySprites) {
    const toughSprite = new Sprite(resources.tough.texture);
    toughSprite.width = 120;
    toughSprite.height = 120;
    toughSprite.anchor.x = 0.5;
    toughSprite.anchor.y = 0.5;
    parent.addChild(toughSprite);
    bodySprites.push(toughSprite);
    return toughSprite;
}

/**
 * Allow supporting body: { "0": { ... } }
 */
function safeBody(body) {
    if (Array.isArray(body)) {
        return body;
    }

    return Object.keys(body).sort().map(idx => body[idx]);
}

export default ({
    logger,
    rootContainer,
    scope,
    stage,
    state,
    payload: {
        parentId,
    } = {},
}) => {
    const { resources } = stage;

    const parent = parentId ? scope[parentId] : rootContainer;
    if (!parent) {
        logger.warn('No parent available with id', parentId);
        return;
    }

    if (scope.bodySprites) {
        scope.bodySprites.forEach(bodySprite => parent.removeChild(bodySprite));
    } else {
        scope.bodySprites = [];
    }

    const { body } = state;

    const filteredBody = safeBody(body).filter(({ type, hits }) =>
        type !== 'tough' && type !== 'carry' && hits > 0);

    const bodyTransformed = Object.values(filteredBody.reduce((result, { type, hits }) => {
        const bodyPart = result[type];
        if (bodyPart) {
            bodyPart.hits += hits;
        } else {
            result[type] = { type, hits };
        }
        return result;
    }, {}));

    bodyTransformed.sort((a, b) => {
        if (a.hits < b.hits) {
            return -1;
        } else if (a.hits > b.hits) {
            return 1;
        } else {
            return 0;
        }
    });

    let frontAngle = 0;
    let backAngle = Math.PI;

    bodyTransformed.forEach((bodyItem) => {
        const bodyPart = BODY_PARTS[bodyItem.type];
        if (bodyPart) {
            const { backSide, color } = bodyPart;
            const startAngle = backSide ? backAngle : frontAngle;
            const angle = PART_ANGLE * (bodyItem.hits / MAX_PART_HITS);
            createBodyPartSprite(color, startAngle, startAngle + angle,
                parent, scope.bodySprites, false);
            createBodyPartSprite(color, -startAngle, -(startAngle + angle),
                parent, scope.bodySprites, true);
            if (backSide) {
                backAngle += angle;
            } else {
                frontAngle += angle;
            }
        } else {
            logger.warn(`Unsupported type ${bodyItem.type}`);
        }
    });

    if (safeBody(body).filter(({ type, hits }) => type === 'tough' && hits > 0).length > 0) {
        createToughSprite(resources, parent, scope.bodySprites);
    }
};
