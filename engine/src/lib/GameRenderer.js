/**
 * Created by vedi on 04/04/2017.
 */
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import actionHelper from './utils/actionHelper';

import { ActionManager } from './actions';
import World from './World';
import * as decorations from './decorations';

const { Application, utils } = PIXI;

const THRESHOLD = 500;

export default class GameRenderer {
    static compileMetadata(metadata) {
        if (metadata.isCompiled) {
            return;
        }
        Object.values(metadata.objects).forEach((objectMetadata) => {
            if (objectMetadata.calculations) {
                objectMetadata.calculations.forEach((calculation) => {
                    if (_.isUndefined(calculation.func)) {
                        throw new Error(
                            `Calculation ${calculation.id} does not have a func specified`);
                    }
                    if (!_.isFunction(calculation.func)) {
                        calculation.func = actionHelper.compileExpression(calculation.func);
                    }
                });
            }
            if (objectMetadata.processors) {
                objectMetadata.processors.forEach((processor) => {
                    if (processor.shouldRun && !_.isFunction(processor.shouldRun)) {
                        processor.shouldRun = actionHelper.compileExpression(processor.shouldRun);
                    }
                    if (processor.until && !_.isFunction(processor.until)) {
                        processor.until = actionHelper.compileExpression(processor.until);
                    }
                    if (processor.when && !_.isFunction(processor.when)) {
                        processor.when = actionHelper.compileExpression(processor.when);
                    }
                });
            }
            if (objectMetadata.data) {
                Object.entries(objectMetadata.data).forEach(([key, value]) => {
                    objectMetadata.data[key] = actionHelper.compileExpression(value);
                });
            }
        });
        metadata.isCompiled = true;
    }

    /**
     * @param {Object} options
     * @param {Boolean} options.autoFocus set camera to 1st object in 1st state
     * @param {Boolean} options.autoStart run looping after initialization
     * @param {Boolean} options.useDefaultLogger
     * @param {Boolean} options.logger
     * @param {Object} options.size
     * @param {Number} options.size.width
     * @param {Number} options.size.height
     * @param {Object} options.worldConfigs
     * @param {Object} options.resourceMap
     * @param {Function} [options.onGameLoop]
     * @param {Boolean} [options.countMetrics=false]
     */
    constructor(options) {
        this.released = true;
        this.animate = this.animate.bind(this);
        this.animateChecker = this.animateChecker.bind(this);
        this.options = options;
        if (options.countMetrics) {
            this.metrics = { fps: 0.0 };
        }
        this.__ts = Date.now();
    }

    /**
     * Initialises the instance.
     * It loads resources, and creates the world objects.
     * @return {Promise.<void>}
     */
    async init(container) {
        const {
            autoStart = true,
            backgroundColor,
            size: {
                width,
                height,
            } = {
                width: 800,
                height: 800,
            },
            worldConfigs,
            resourceMap,
            rescaleResources,
            useDefaultLogger = false,
            logger = useDefaultLogger ? console : new Proxy({}, { get: () => () => {} }),
            objectFilter,
        } = this.options;
        if (!this.released) {
            this.release();
        }
        const app = new Application(width, height, {
            antialias: true,
            transparent: !backgroundColor,
            forceCanvas: worldConfigs.forceCanvas,
        });
        this.app = app;
        if (backgroundColor) {
            app.renderer.backgroundColor = backgroundColor;
        }
        this.actionManager = new ActionManager();
        this.world = new World({
            actionManager: this.actionManager,
            app,
            logger,
            objectFilter,
            rescaleResources,
            resourceMap,
            size: { width, height },
            ...worldConfigs,
        });

        this.resize();

        this.released = false;
        await this.world.init();

        container.appendChild(app.view);

        if (autoStart) {
            this.start();
        }
    }

    release() {
        if (!this.released) {
            clearTimeout(this.animateCheckerTimer);
            this.world.release();
            utils.destroyTextureCache();
            this.app.destroy();
            this.released = true;
        }
    }

    /**
     * Starts game loop.
     */
    start() {
        const { options: { countMetrics } } = this;
        if (countMetrics) {
            this.lastLoopTime = new Date();
        }
        this.lastAnimationRun = Date.now();
        this.animateChecker();
        this.app.ticker.add(this.animate);
    }

    animateChecker() {
        if (Date.now() - this.lastAnimationRun > THRESHOLD) {
            this.animate();
        }
        this.animateCheckerTimer = setTimeout(this.animateChecker, THRESHOLD);
    }

    applyState(state, tickDuration) {
        const result = this.world.applyState(state, tickDuration);
        return result;
    }

    get zoomLevel() {
        const { app: { stage } = {} } = this;
        return stage.scale.x;
    }

    /**
     * Sets zoom level of the stage.
     * @param value
     */
    set zoomLevel(value) {
        const { app: { stage, renderer } = {} } = this;
        value = Math.round(value / (100 / 5000)) * (100 / 5000);
        if (stage) {
            const oldScale = stage.scale.x;
            stage.scale.x = value;
            stage.scale.y = value;
            if (value !== oldScale) {
                renderer.emit('_resized');
            }
        }
    }

    pan(x, y) {
        this.app.stage.position.x += x;
        this.app.stage.position.y += y;
    }

    zoomTo(value, x, y) {
        const oldZoomLevel = this.zoomLevel;
        this.zoomLevel = value;
        const panX = (x - this.app.stage.position.x) * (1 - (this.zoomLevel / oldZoomLevel));
        const panY = (y - this.app.stage.position.y) * (1 - (this.zoomLevel / oldZoomLevel));
        this.pan(panX, panY);
    }

    /**
     * Sets terrain.
     * @param {Object} terrain
     */
    setTerrain(terrain) {
        return this.world.applyState({ objects: terrain, setTerrain: true }, 0, false);
    }

    /**
     * Resize renderer to a new canvas size
     */
    resize(newSize) {
        const {
            app: { renderer } = {},
        } = this;

        if (!renderer) {
            return;
        }

        if (newSize) {
            renderer.resize(newSize.width, newSize.height);
        }
    }

    animate() {
        this.lastAnimationRun = Date.now();
        this.actionManager.update();

        const { options: { countMetrics, onGameLoop } } = this;

        if (countMetrics) {
            const currentLoopTime = new Date();
            const fps = 1000 / (currentLoopTime - this.lastLoopTime);
            this.metrics.fps = Math.round((this.metrics.fps * 0.95) + (fps * 0.05));
            this.lastLoopTime = currentLoopTime;
            Object.assign(this.metrics, this.world.metrics);
        }

        if (onGameLoop) {
            onGameLoop();
        }
    }

    erase() {
        this.world.removeAllObjects();
    }

    setDecorations(decorationItems) {
        decorations.set(decorationItems, { world: this.world });
    }

    static isWebGLSupported() {
        return utils.isWebGLSupported();
    }
}
