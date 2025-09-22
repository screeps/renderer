import * as PIXI from 'pixi.js';
import { MIPMAP_MODES, SCALE_MODES, BaseTexture } from 'pixi.js';
import { applyRendererMixin } from '@pixi/layers';


const svgBlobLoader = {
  extension: {
    type: PIXI.ExtensionType.LoadParser,
    name: 'svgBlobLoader',
  },
  async test(url) {    
    if (url.startsWith('blob:')) {
      return true;
    }    
    return false;
  },
  async load(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';      
      img.onload = () => {
        resolve(PIXI.Texture.from(img));        
      };
      img.onerror = () => {
        reject(new Error(`Failed to load SVG Blob URL`));
      };
      img.src = url;
    });
  },
};

// Register the SVG loader extension
PIXI.extensions.add(svgBlobLoader);

if (typeof window !== 'undefined') {
  window.PIXI = PIXI;
}

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.LINEAR;
BaseTexture.defaultOptions.mipmap = MIPMAP_MODES.ON;

applyRendererMixin(PIXI.Renderer);

export default PIXI;
