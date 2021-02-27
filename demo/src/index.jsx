import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import terrain from 'C:\\Home\\screeps\\arena-cli\\replay\\terrain.json';
import samples from 'C:\\Home\\screeps\\arena-cli\\replay\\300.json';
import _ from 'lodash';

function arraysToObject(obj) {
    for(var key in obj) {
        if(_.isArray(obj[key])) {
            var result = {};
            for(var i=0; i<obj[key].length; i++) {
                result[i] = obj[key][i];
            }
            obj[key] = result;
        }
    }
}

function applyDiff(objects, diff) {
    for (var id in diff) {
        var objDiff = diff[id];
        var obj = _.find(objects, {_id: id});
        if(obj) {
            if(objDiff !== null) {
                arraysToObject(obj);
                arraysToObject(objDiff);
                obj = _.merge(obj, objDiff, (a,b)=>{
                    if (_.isArray(a) && _.isArray(b)) {
                        return b;
                    }
                });
            }
            else {
                _.remove(objects, {_id: id});
            }
        }
        else if(objDiff) {
            obj = _.cloneDeep(objDiff);
            objects.push(obj);
        }
    }
}

function start(_terrain, _samples) {

    if(_samples.ticks) {
        let newSamples = [], objects = [], users = {};
        for(var i in _samples.ticks) {
            applyDiff(objects, _samples.ticks[i]);
            objects.forEach(object => {
                if(object.user && !users[object.user]) {
                    users[object.user] = {
                        "_id": object.user,
                        "username": "Screeps"
                    }
                }
            });
            newSamples.push({
                gameTime: +i,
                info: {},
                flags: [],
                visual: "",
                users,
                objects: _.cloneDeep(objects)
            });
        }
        _samples = newSamples;
    }


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
