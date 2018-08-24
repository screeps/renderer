import { loader, Texture, BaseTexture, utils } from 'pixi.js';
import actionHelper from './utils/actionHelper';

const { TextureCache } = utils;

const VIEW_BOX = 5000;
const MIN_SVG_RENDER_SIZE = 100;
const MAX_SVG_RENDER_SIZE = 2000;
const STEP_SVG_RENDER_SIZE = 100;

const svgCache = {};

export default class ResourceManager {
    constructor(options) {
        const { logger, app } = options;
        this.logger = logger;
        this.app = app;
        this.delivering = false;
        this.loadedResources = {};
        this.queue = [];
        // eslint-disable-next-line no-undef
        this.maxSvgSize = window.screen.availWidth || MAX_SVG_RENDER_SIZE;
        this.maxSvgSize = Math.round(this.maxSvgSize / STEP_SVG_RENDER_SIZE) * STEP_SVG_RENDER_SIZE;
    }

    load(resourceMap = {}, rescaleResources = []) {
        return new Promise((resolve, reject) => {
            try {
                Object.keys(resourceMap).forEach(key => loader.add(key, resourceMap[key]));
                loader.load((loader, resources) => {
                    Object.assign(this.loadedResources, resources);
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        })
            .then(() => Promise.all(rescaleResources.map((key) => {
                const resource = this.loadedResources[key];
                if (!resource) {
                    this.logger.error('Cannot create scaled textures for', key);
                }
                resource.texture._resourceName = resource.name;
                return new Promise((resolve, reject) => {
                    if (svgCache[resource.name]) {
                        resolve();
                    } else {
                        // eslint-disable-next-line no-undef
                        const svgXhr = new XMLHttpRequest();
                        svgXhr.onload = () => {
                            if (svgXhr.readyState !== svgXhr.DONE || svgXhr.status !== 200) {
                                throw new Error('Failed to load SVG using XHR.');
                            }

                            svgCache[resource.name] = svgXhr.response;
                            resolve();
                        };
                        svgXhr.onerror = reject;
                        svgXhr.open('GET', resource.url, true);
                        svgXhr.send();
                    }
                })
                    .then(() => {
                        const promises = [];
                        for (let size = MIN_SVG_RENDER_SIZE; size <= this.maxSvgSize;
                            size += STEP_SVG_RENDER_SIZE) {
                            let texture = TextureCache[resource.name + size];
                            if (!texture) {
                                const baseTexture = new BaseTexture();
                                baseTexture.sourceScale = size / VIEW_BOX;
                                baseTexture.imageUrl = resource.url;
                                baseTexture.source = resource.data;
                                baseTexture._loadSvgSourceUsingString(svgCache[resource.name]);
                                texture = new Texture(baseTexture);
                                Texture.addToCache(texture, resource.name + size);
                            }
                            resource.scaledSvgTextures = resource.scaledSvgTextures || {};
                            resource.scaledSvgTextures[size] = texture;
                            promises.push(
                                new Promise(resolve =>
                                    actionHelper.onTextureLoaded(texture, resolve)));
                        }
                        return Promise.all(promises);
                    });
            })))
            .then(() => this.loadedResources);
    }

    async getResource(name, ...otherParams) {
        const { logger } = this;
        if (!this.delivering) {
            logger.debug(`Getting resource ${name}`);
            return this.loadedResources[name] || this._loadResource(name, ...otherParams);
        } else {
            return new Promise((resolve, reject) => {
                logger.debug(`Put resource to queue resource ${name}`);
                this.queue.push({
                    resource: { name, otherParams: { ...otherParams } },
                    resolve,
                    reject,
                });
            });
        }
    }

    getCachedResource(name) {
        return this.loadedResources[name];
    }

    release() {
        this.loadedResources = {};
        loader.reset();
    }

    async _loadResource(name, url = name) {
        const { logger } = this;
        this.delivering = true;
        try {
            const options = { loadType: 2 };
            loader.add(name, url, options);
            logger.debug(`Delivering resource ${name}`);
            const resources = await this.load();
            return resources[name];
        } finally {
            loader.reset();
            this.delivering = false;
            this._loadRest();
        }
    }

    async _loadRest() {
        const { logger } = this;
        const nextOne = this.queue.shift();
        if (nextOne) {
            const {
                resource: { name, otherParams: { ...otherParams } },
                resolve,
                reject,
            } = nextOne;
            try {
                logger.debug(`Taking the next resource ${name}`);
                resolve(await this.getResource(name, ...otherParams));
            } catch (err) {
                logger.warn(`Something wrong loading resource ${name}`, err);
                reject(err);
            }
            await this._loadRest();
        } else {
            logger.debug('No resource in queue. Idling');
        }
    }
}
