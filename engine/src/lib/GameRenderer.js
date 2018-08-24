/**
 * Created by vedi on 04/04/2017.
 */
import _ from 'lodash';
import * as PIXI from 'pixi.js';
import { convertGameXYToWorld } from '../../../helpers/mathHelper';
import actionHelper from './utils/actionHelper';

import { ActionManager } from './actions';
import World from './World';

const { Application, utils } = PIXI;

const THRESHOLD = 500;

export default class GameRenderer {
    static compileMetadata(metadata) {
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
    }

    /**
     * Initialises the instance.
     * It loads resources, and creates the world objects.
     * @return {Promise.<void>}
     */
    async init(container) {
        const {
            autoFocus = true,
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

        this.shouldSetCamera = autoFocus;
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
        if (this.shouldSetCamera) {
            const { worldConfigs } = this.options;
            const worldPosition = this.world.getWorldPosition();
            if (worldPosition) {
                this.cameraPosition = convertGameXYToWorld(worldPosition, worldConfigs);
                this.shouldSetCamera = false;
            }
        }
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
        if (stage) {
            const oldScale = stage.scale.x;
            stage.scale.x = value;
            stage.scale.y = value;
            if (value !== oldScale) {
                renderer.emit('_resized');
            }
        }
    }

    /**
     * Sets camera position of the stage.
     * @param {Object} position
     * @param {Number} position.x
     * @param {Number} position.y
     */
    set cameraPosition(position) {
        const { x, y } = position;
        const { app: { stage, renderer } } = this;
        stage.pivot.x = x;
        stage.pivot.y = y;
        stage.position.x = renderer.width / 2;
        stage.position.y = renderer.height / 2;
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
            options: { fitToWorld, worldConfigs: { CELL_SIZE } },
            app: { renderer } = {},
        } = this;

        if (!renderer) {
            return;
        }

        if (newSize) {
            renderer.resize(newSize.width, newSize.height);
        }

        if (fitToWorld) {
            const scaleX = renderer.width / (CELL_SIZE * fitToWorld.width);
            const scaleY = renderer.height / (CELL_SIZE * fitToWorld.height);
            this.zoomLevel = Math.min(scaleX, scaleY);
            this.cameraPosition = {
                x: ((fitToWorld.width / 2) - 0.5) * CELL_SIZE,
                y: ((fitToWorld.height / 2) - 0.5) * CELL_SIZE,
            };
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

    static isWebGLSupported() {
        return utils.isWebGLSupported();
    }
}
