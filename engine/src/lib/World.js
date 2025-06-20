/**
 * Created by vedi on 18/03/2017.
 */

import { Container, Renderer, Graphics } from 'pixi.js';
import { Stage, Layer } from '@pixi/layers';
import { Assets } from '@pixi/assets';

import PROCESSORS from './processors';
import actionHelper from './utils/actionHelper';
import GameObject from './GameObject';

// window.PIXI.display.Group.compareZIndex = function (a, b) {
//    if (a.zIndex !== b.zIndex) {
//        return a.zIndex - b.zIndex;
//    }
//    if (a.zOrder > b.zOrder) {
//        return -1;
//    }
//    if (a.zOrder < b.zOrder) {
//        return 1;
//    }
//    return a.updateOrder - b.updateOrder;
// }

export default class World {
    constructor(options) {
        this.gameObjects = {};
        this.decorations = [];
        this.options = options;
        const { app, actionManager, logger, metadata = {}, resourceMap,
            CELL_SIZE, VIEW_BOX } = this.options;
        this.metadata = metadata;

        const { objects: metadataObjects = {} } = this.metadata;
        const {
            _all: {
                actions: allActions = [],
                calculations: allCalculations = [],
                processors: allProcessors = [],
                data: allData = {},
            } = {},
            ...otherObjectMetadata
        } = metadataObjects;
        Object.entries(otherObjectMetadata).forEach(([, objectMetadata]) => {
            if (objectMetadata) {
                const {
                    actions = [],
                    calculations = [],
                    data = [],
                    processors = [],
                } = objectMetadata;
                objectMetadata.actions = [...allActions, ...actions];
                objectMetadata.data = { ...allData, ...data };
                objectMetadata.calculations = [...allCalculations, ...calculations];
                objectMetadata.processors = [...allProcessors, ...processors];
            }
        });

        // renderer stuff
    app.stage = new Stage(); // Use Container as the root stage
    // Ensure zIndex is respected for layers ordering
    app.stage.sortableChildren = true;
        app.stage.pivot.x = -CELL_SIZE / 2;
        app.stage.pivot.y = -CELL_SIZE / 2;        
        this.app = app;
        this.stage = app.stage;
        this.stage.actionManager = actionManager;
        this.resourceMap = resourceMap;
        this.layers = {};
        this.defaultLayerId = null;
        this.unmaskedRendererInfo = null;

        if (this.app.renderer instanceof Renderer) {
            const { gl } = this.app.renderer.state;
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            this.unmaskedRendererInfo = debugInfo &&
                gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        /*const mask = new Graphics();
        mask.drawRect(-CELL_SIZE / 2, -CELL_SIZE / 2, VIEW_BOX, VIEW_BOX);
        app.stage.addChild(mask);
        app.stage.mask = mask;*/
    }    
    async init() {
        const { options: { logger } } = this;
        
        try {
            // Add all assets to the Assets loader
            Object.keys(this.resourceMap).forEach(key => {
                Assets.add(key, this.resourceMap[key]);
            });
            
            
            // Load all assets
            logger.debug('Loading resources...');
            await Assets.load(Object.keys(this.resourceMap));
            logger.debug('Resources loaded successfully');
        } catch (err) {
            logger.error('Failed to load resources:', err);
            throw err;
        }

        this.metadata.layers.forEach(({ id, isDefault = false, afterCreate = () => {} }, index) => {
            const layer = new Layer();
            layer.__id = id;
            layer.group.enableSort = true;
            // Ensure children are sorted by their zIndex property
            layer.group.on('sort', (sprite) => {
                // Map zIndex (used across our code) to zOrder (used by @pixi/layers)
                sprite.zOrder = sprite.zIndex || 0;
            });
            // Sorting should also consider children whose parentLayer differs from their parent
            layer.group.sortPriority = 1;
            layer.zIndex = index;
            this.stage.addChild(layer);
            this.layers[id] = layer;
            if (isDefault) {
                if (this.defaultLayerId) {
                    throw new Error('defaultLayer is already specified');
                }
                this.defaultLayerId = id;
            }
            afterCreate(layer, {
                app: this.app,
                world: this,
            });
        });
    }

    applyState(state, tickDuration = 0, globalOnly = true) {
        const {
            gameObjects,
            metadata: { objects: metadataObjects, preprocessors },
            options: { gameData = {}, logger, objectFilter },
        } = this;
        const { objects } = state;
        state.gameData = gameData;
        this.runStatePreprocessor(
            preprocessors.map(preprocessorName => PROCESSORS[preprocessorName]),
            { state, world: this }
        );
        if (!globalOnly) {
            return;
        }
        const statesMap = {};
        const filteredObjects = objectFilter ? objectFilter(objects) : objects;
        filteredObjects.forEach((objectState) => {
            const {
                type, room, x, y, _id: id = `${room}:${type}:${x}:${y}`,
            } = objectState;
            let gameObject = gameObjects[id];
            if (!gameObject) {
                const objectMetadata = metadataObjects[type];
                if (objectMetadata) {
                    gameObject = new GameObject(id, objectMetadata, this);
                    gameObjects[id] = gameObject;
                    logger.debug(`Created new game object with ID ${id}`);
                } else if (objectMetadata === undefined) {
                    logger.warn(`Unsupported object type: ${type}`);
                }
            }
            statesMap[id] = objectState;
        });

        Object.values(gameObjects).forEach((gameObject) => {
            const { id } = gameObject;
            const objectState = statesMap[id];
            // delete object if it did not come
            if (objectState) {
                logger.debug(`Applying state to game object ${objectState.type} with ID ${id}`);
                return gameObject.applyState(objectState, tickDuration, state);
            } else if (globalOnly) {
                gameObject.remove(tickDuration);
                delete gameObjects[id];
                logger.debug(`Remove game object with ID ${id}`);
            }
        });
    }

    removeAllObjects() {
        Object.values(this.gameObjects).forEach((gameObject) => {
            gameObject.remove(0);
            delete this.gameObjects[gameObject.id];
        });
    }

    runStatePreprocessor(preprocessors = [], preprocessorParams) {
        preprocessors.forEach(preprocessor => preprocessor(preprocessorParams));
    }    
    
    release() {
        Assets.reset();
    }   

    async getResource(name, url = name) {
        const { options: { logger } } = this;
        
        // Check if already cached
        const cached = Assets.get(name);
        if (cached) {
            logger.debug(`Getting cached resource ${name}`);
            return cached;
        }

        // Load new resource
        try {
            logger.debug(`Loading resource ${name}`);
            Assets.add(name, url);
            const resource = await Assets.load(name);
            return resource;
        } catch (err) {
            logger.warn(`Failed to load resource ${name}:`, err);
            throw err;
        }
    }

    get metrics() {
        let gameObjectCounter = 0;
        let rendererCounter = 0;
        Object.values(this.gameObjects).forEach((gameObject) => {
            gameObjectCounter += 1;
            rendererCounter += gameObject.rendererCounter;
        });        const rendererMetrics = {
            size: this.app.renderer.width,
        };
        if (this.app.renderer instanceof Renderer) {
            Object.assign(rendererMetrics, {
                WebGL: 'enabled',
                GPU: this.unmaskedRendererInfo,
            });
        } else {
            Object.assign(rendererMetrics, { WebGL: 'disabled' });
        }

        return {
            gameObjectCounter,
            rendererCounter,
            // eslint-disable-next-line no-undef
            devicePixelRatio: window.devicePixelRatio,
            stageSize: this.app.stage.scale.x * this.options.VIEW_BOX,
            renderer: rendererMetrics,
        };
    }

    getWorldPosition() {
        const { gameObjects } = this;
        const gameObjectValues = Object.values(gameObjects);
        if (gameObjectValues.length === 0) {
            return { x: 0, y: 0 };
        }
        const { x, y } = gameObjectValues[0].state;
        return { x, y };
    }

    createData({ layer: layerId = this.defaultLayerId }) {
        const container = new Container();
        container.parentLayer = this.layers[layerId];
        this.stage.addChild(container);
        return container;
    }

    destroyData(container) {
        container.destroy();
    }

    runProcessor(processorMetadata, processorParams) {
        const { name, type = name } = processorMetadata;
        const runProcessorFn = PROCESSORS[type].run || PROCESSORS[type];
        if (!runProcessorFn) {
            throw new Error(`No processor found for ${type}`);
        }
        const { logger } = this.options;
        logger.debug('run processor', type);
        return runProcessorFn({ stage: this.stage, logger, ...processorParams });
    }

    destructProcessor(processorMetadata, processorParams, obj) {
        const { name, type = name } = processorMetadata;
        const {
            destruct: destructProcessorFn,
            config: { isOwner = true } = {},
        } = PROCESSORS[type];
        if (destructProcessorFn) {
            const { logger } = this.options;
            logger.debug('run destruct', type);
            return destructProcessorFn({ stage: this.stage, logger, ...processorParams });
        }
        if (obj && isOwner) {
            this.cancelActionsForObj(obj);
            obj.destroy();
        }
    }

    runActions(actionsMeta = [], params, target = params.rootContainer) {
        const { stage: { actionManager } } = this;
        const actions = actionsMeta.map(actionMeta =>
            actionHelper.createAction(actionMeta, { ...params, target }));
        return actions.map(action => actionManager.runAction(target, action));
    }

    cancelActions(actions) {
        const { stage: { actionManager } } = this;
        actions.forEach((action) => {
            actionManager.cancelAction(action);
        });
    }

    cancelActionsForObj(obj) {
        const { stage: { actionManager } } = this;
        actionManager.cancelActionForContainer(obj);
        const { children } = obj;
        if (children && Array.isArray(children)) {
            children.forEach(child => this.cancelActionsForObj(child));
        }
    }

    finishActions(actions) {
        const { stage: { actionManager } } = this;
        actions.forEach((action) => {
            actionManager.finishAction(action);
        });
    }

    countObjects(data) {
        let childrenCounter = 1;
        data.children.forEach((child) => {
            childrenCounter += this.countObjects(child);
        });
        return childrenCounter;
    }
}
