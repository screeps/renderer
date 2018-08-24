import React, { Component, PropTypes } from 'react';

import GameRenderer from '../../../engine/dist/renderer';
// import GameRenderer from '../../../engine/src';
import { resourceMap, rescaleResources } from '../config/resourceMap';
import worldConfigs from '../config/worldConfigs';

const TICK_DURATION = 2.5;

export default class Canvas extends Component {
    /**
     * Define our prop types
     */
    static propTypes = {
        zoomLevel: PropTypes.number.isRequired,
        onMetricsUpdate: PropTypes.func,
    };

    static defaultProps = {
        onMetricsUpdate: null,
    };

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     */
    async componentDidMount() {
        const startTime = new Date();
        const { samples, terrain, onGameLoop } = this.props;
        console.log(`compileExpression at ${startTime}`);
        GameRenderer.compileMetadata(worldConfigs.metadata);
        console.log(`compiled in ${Date.now() - startTime.getTime()}`);
        this.gameApp = new GameRenderer({
            autoFocus: false,
            size: {
                width: 700,
                height: 700,
            },
            resourceMap,
            worldConfigs,
            onGameLoop,
            rescaleResources,
            countMetrics: true,
            useDefaultLogger: true,
            backgroundColor: 0x555555,
            fitToWorld: { width: 50, height: 50 },
        });

        this.metricsUpdate();

        // eslint-disable-next-line react/no-string-refs
        await this.gameApp.init(this.refs.gameCanvas);
        await this.gameApp.setTerrain(terrain);

        this.gameApp.resize();
        this.baseZoomLevel = this.gameApp.zoomLevel;

        let i = 0;
        const sampleFn = () => {
            const sample = samples[i];
            const startApplyTime = new Date();
            console.log(`run sample #${i} at ${startApplyTime}`);
            this.gameApp.applyState(sample, TICK_DURATION);
            console.log(`applied in ${Date.now() - startApplyTime.getTime()}`);
            if (i < samples.length - 1) {
                i += 1;
            } else {
                i = 0;
            }
            setTimeout(sampleFn, 1000 * TICK_DURATION);
        };
        setTimeout(sampleFn, 0);
    }

    /**
     * When we get new props, run the appropriate imperative functions
     */
    componentWillReceiveProps(nextProps) {
        this.updateZoomLevel(nextProps);
    }

    /**
     * shouldComponentUpdate is used to check our new props against the current
     * and only update if needed
     */
    shouldComponentUpdate(nextProps) {
        // this is easy with 1 prop, using Immutable helpers make
        // this easier to scale

        return nextProps.zoomLevel !== this.props.zoomLevel;
    }

    baseZoomLevel = 1;

    metricsUpdate = () => {
        const { onMetricsUpdate } = this.props;
        if (onMetricsUpdate) {
            onMetricsUpdate(this.gameApp.metrics);
        }
        setTimeout(this.metricsUpdate, 1000);
    };

    /**
     * Update the stage "zoom" level by setting the scale
     */
    updateZoomLevel = (props) => {
        this.gameApp.zoomLevel = this.baseZoomLevel * props.zoomLevel;
    };


    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     */
    render() {
        return (
            // eslint-disable-next-line react/no-string-refs
            <div className="game-canvas-container" ref="gameCanvas" />
        );
    }
}
