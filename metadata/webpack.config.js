const path = require('path');

const config = {
    entry: path.join(__dirname, 'src/index.js'),
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'renderer-metadata.js',
        library: 'RENDERER_METADATA',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
};

module.exports = config;
