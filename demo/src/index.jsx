import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import terrain from './samples/terrain1.json';
import samples from './samples/structures.json';

function start(_terrain, _samples) {
    ReactDOM.render(
        <App samples={_samples} terrain={_terrain} />,
        document.getElementById('root'),
    );
}

if (window.nodeRequire !== undefined) {
    // Electron build: loading from transferred data
    const { ipcRenderer } = window.nodeRequire('electron');
    ipcRenderer.on('set-sample-data', (evt, data) => {
        start(terrain, JSON.parse(data));
    });
    ipcRenderer.send('ready');
} else {
    // Web build: loading from hardcoded data
    start(terrain, samples);
}
