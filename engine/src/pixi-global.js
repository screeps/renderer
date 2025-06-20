import * as PIXI from 'pixi.js';
import { Assets } from '@pixi/assets';
import { applyRendererMixin } from '@pixi/layers';

if (typeof window !== 'undefined') {
  window.PIXI = PIXI;
  // Ensure Assets is available on PIXI global
  if (!PIXI.Assets) {
    PIXI.Assets = Assets;
  }
}

PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.ON;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

applyRendererMixin(PIXI.Renderer);

export default PIXI;
