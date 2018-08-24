/**
 * Created by vedi on 18/03/2017.
 */

import _ from 'lodash';

import resolveProp from './utils/resolveProp';
import actionHelper from './utils/actionHelper';

/**
 * It's js doc
 */
export default class GameObject {
    constructor(id, objectMetadata, world) {
        /**
         * Initial data from state.
         * @type {{}}
         */
        this.state = undefined;

        this.calcs = {};

        this.rootContainer = {};
        this.id = id;
        this.objectMetadata = objectMetadata;
        this.world = world;
        this.rootContainer = world.createData(objectMetadata);
        this.rootContainer.zIndex = objectMetadata.zIndex || 0;
        if (objectMetadata.processors) {
            let zIndex = 0;
            objectMetadata.processors.forEach((processor) => {
                processor.id = processor.id || `id#${Math.floor(100000 * Math.random())}`;
                processor.zIndex = processor.zIndex || zIndex;
                zIndex += 1;
            });
        }
        if (objectMetadata.actions) {
            objectMetadata.actions.forEach((action) => {
                action.id = action.id || `id#${Math.floor(100000 * Math.random())}`;
            });
        }
        this.scope = { actions: {}, processors: {} };
    }

    remove(tickDuration) {
        const { world, rootContainer, scope, objectMetadata } = this;
        const { disappearProcessor } = objectMetadata;
        if (disappearProcessor) {
            const processorParams = {
                objectMetadata,
                rootContainer,
                scope,
                tickDuration,
                callback: () => this._destroy(),
            };
            world.runProcessor(disappearProcessor, processorParams);
        } else {
            this._destroy();
        }
    }

    _destroy() {
        const { world, rootContainer, scope, objectMetadata } = this;
        objectMetadata.processors.forEach((processor) => {
            const params = { objectMetadata: processor, rootContainer, scope };
            this.destructProcessor(scope, processor, params);
        });
        this.world.cancelActionsForObj(rootContainer);
        world.destroyData(rootContainer);
    }

    applyState(objectState, tickDuration, state) {
        const {
            state: prevState,
            calcs: prevCalcs,
            world,
            rootContainer,
            scope,
            objectMetadata,
            world: { options: { logger } },
        } = this;
        const firstRun = !prevState;
        const calcs = { ...prevCalcs };
        const stateParams = {
            calcs,
            firstRun,
            objectMetadata,
            prevCalcs,
            prevState,
            world,
            rootContainer,
            scope,
            state: objectState,
            stateExtra: state,
            tickDuration,
        };
        if (firstRun) {
            if (objectMetadata.data) {
                Object.entries(objectMetadata.data).forEach(([key, value]) => {
                    this.rootContainer[key] = actionHelper.parseExpression(value, stateParams);
                });
            }
        }
        if (objectMetadata.calculations) {
            objectMetadata.calculations.forEach((calculation) => {
                const propsChanged = this.propsChanged(calculation, stateParams);
                if (this.shouldRun(calculation, stateParams, { firstRun, propsChanged })) {
                    const { path = null, id = 'customField', func } = calculation;
                    const stateToPass =
                        (path === null ? objectState : resolveProp(objectState, path));
                    const prevStateToPass =
                        (path === null ? prevState : resolveProp(prevState, path));
                    const params = {
                        ...stateParams,
                        state: stateToPass,
                        prevState: prevStateToPass,
                        payload: calculation.payload,
                    };
                    calcs[id] = actionHelper.parseExpression(func, params);
                    logger.debug('Calculation', id, 'set to', calcs[id]);
                }
            });
        }
        // apply actions to root object
        if (objectMetadata.actions) {
            objectMetadata.actions.map((action) => {
                const hasTarget = !action.targetId || scope[action.targetId];
                if (hasTarget) {
                    const targetObject = action.targetId ? scope[action.targetId] : undefined;
                    const actionScope = scope.actions[action.id];
                    const { animations } = actionScope || {};
                    const firstRun = !actionScope;
                    const propsChanged = this.propsChanged(action, stateParams);
                    const shouldRun = this.shouldRun(
                        action, stateParams, { propsChanged, firstRun });
                    const onceAllow = this.onceAllow(action, { propsChanged, firstRun });
                    const shouldDestruct = !shouldRun && this.shouldDestruct(action, stateParams,
                        { propsChanged, firstRun });
                    if (shouldRun && onceAllow) {
                        if (animations) {
                            this.world.finishActions(animations);
                        }
                        scope.actions[action.id] = {
                            animations: this.world.runActions(
                                action.actions, stateParams, targetObject),
                        };
                    } else if (shouldDestruct) {
                        if (animations) {
                            this.world.finishActions(animations);
                        }
                        delete scope.actions[action.id];
                    }
                }
                return [];
            });
        }
        objectMetadata.processors.forEach((processor) => {
            const firstRun = !scope.processors[processor.id];
            const propsChanged = this.propsChanged(processor, stateParams);
            const shouldRun = this.shouldRun(processor, stateParams,
                { propsChanged, firstRun });
            const shouldDestruct = !shouldRun && this.shouldDestruct(processor, stateParams,
                { propsChanged, firstRun });
            if (shouldRun || shouldDestruct) {
                const { layer: layerId, path = null, zIndex } = processor;
                const stateToPass = (path === null ? objectState : resolveProp(objectState, path));
                const prevStateToPass = (path === null ? prevState : resolveProp(prevState, path));
                const paramsToPass = {
                    ...stateParams,
                    state: stateToPass,
                    prevState: prevStateToPass,
                    ...processor,
                };
                const onceAllow = this.onceAllow(processor, { propsChanged, firstRun });
                if (shouldRun && onceAllow) {
                    const result = world.runProcessor(processor, paramsToPass);
                    let processorScope;
                    if (result) {
                        result.zIndex = zIndex;
                        if (layerId) {
                            result.parentLayer = this.world.layers[layerId];
                        }
                        processorScope = {
                            actions: this.world.runActions(
                                processor.actions, paramsToPass, result),
                            obj: result,
                        };
                    } else {
                        processorScope = {};
                    }
                    scope.processors[processor.id] = processorScope;
                } else if (shouldDestruct) {
                    this.destructProcessor(scope, processor, paramsToPass);
                }
            }
        });
        if (objectState.temp || objectState.tempRemove) {
            this.rootContainer.alpha = 0.3;
        }
        this.calcs = calcs;
        this.state = objectState;
    }

    propsChanged(runnableMetadata, stateParams) {
        const { props = '*' } = runnableMetadata;
        const { prevState, state, prevCalcs, calcs } = stateParams;
        if (!prevState) {
            return true;
        }
        return (props === '*' ||
            !!props.find(prop => !_.isEqual(prevState[prop], state[prop])) ||
            !!props.find(prop => !_.isEqual(prevCalcs[prop], calcs[prop])));
    }

    shouldRun(runnableMetadata, stateParams, { propsChanged }) {
        const { shouldRun, when = shouldRun } = runnableMetadata;
        const { prevState, state } = stateParams;
        if (when && !actionHelper.parseExpression(when, stateParams)) {
            return false;
        }
        if (!prevState || !state) {
            return true;
        }
        return propsChanged;
    }

    onceAllow(runnableMetadata, { firstRun }) {
        const { once = false } = runnableMetadata;
        return !once || firstRun;
    }

    shouldDestruct(runnableMetadata, stateParams, { propsChanged }) {
        const { shouldRun, until, when = shouldRun } = runnableMetadata;
        return propsChanged &&
            ((!until && when) || (until && actionHelper.parseExpression(until, stateParams)));
    }

    destructProcessor(scope, processorMetadata, processorParams) {
        const processorScope = scope.processors[processorMetadata.id];
        if (processorScope) {
            const { actions, obj } = processorScope;
            if (actions) {
                this.world.finishActions(actions);
            }
            this.world.destructProcessor(processorMetadata, processorParams, obj);
            delete scope.processors[processorMetadata.id];
        } else {
            this.world.destructProcessor(processorMetadata, processorParams, null);
        }
    }

    get rendererCounter() {
        return this.world.countObjects(this.rootContainer);
    }
}
