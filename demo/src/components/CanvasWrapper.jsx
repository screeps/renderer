/**
 * Created by vedi on 18/03/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Canvas from './Canvas';

export default class CanvasWrapper extends Component {
    static propTypes = {
        samples: PropTypes.arrayOf(PropTypes.shape()).isRequired,
        terrain: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    };

    constructor(props) {
        super(props);

        // store our zoom level in state
        this.state = {
            zoomLevel: 1.0,
            fps: 0.0,
            gameObjectCounter: 0,
            rendererCounter: 0,
            renderer: {},
        };

        this.onMetricsUpdate = this.onMetricsUpdate.bind(this);
        this.onZoomIn = this.onZoomIn.bind(this);
        this.onZoomOut = this.onZoomOut.bind(this);
    }

    onMetricsUpdate({ fps, gameObjectCounter, rendererCounter, renderer }) {
        this.setState({ fps, gameObjectCounter, rendererCounter, renderer });
    }

    /**
     * Event handler for clicking zoom in. Increments the zoom level
     */
    onZoomIn() {
        const { state } = this;
        const zoomLevel = state.zoomLevel + 0.1;
        this.setState({ zoomLevel });
    }

    /**
     * Event handler for clicking zoom out. Decrements the zoom level
     */
    onZoomOut() {
        const { state } = this;
        const zoomLevel = state.zoomLevel - 0.1;

        if (zoomLevel >= 0) {
            this.setState({ zoomLevel });
        }
    }

    render() {
        const {
            props: { samples, terrain },
            state: { fps, gameObjectCounter, rendererCounter, renderer, zoomLevel },
        } = this;
        return (
            <div>
                <span>
                    FPS:{fps},
                    GameObjectCounter:{gameObjectCounter},
                    RendererCounter:{rendererCounter}
                    RendererCounter:{JSON.stringify(renderer)}
                </span>
                <br />
                {/*<button onClick={this.onZoomIn}>Zoom In</button>*/}
                {/*<button onClick={this.onZoomOut}>Zoom Out</button>*/}
                <Canvas
                    zoomLevel={zoomLevel}
                    samples={samples}
                    terrain={terrain}
                    onMetricsUpdate={this.onMetricsUpdate}
                />
            </div>
        );
    }
}
