import './pixi-global';
import * as _PIXI from 'pixi.js';
import _GameRenderer from './lib/GameRenderer';

// eslint-disable-next-line no-undef
if (window) {
// eslint-disable-next-line no-undef
    window.GameRenderer = _GameRenderer;
}

export const GameRenderer = _GameRenderer;
export const PIXI = _PIXI;
export default GameRenderer;
