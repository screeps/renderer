/**
 * Created by vedi on 05/04/2017.
 */

require('webpack');

const config = {
    entry: `${__dirname}/src/index.js`,
    devtool: 'source-map',
    output: {
        path: `${__dirname}/dist`,
        filename: 'renderer-metadata.js',
        library: 'RENDERER_METADATA',
        libraryTarget: 'window',
        libraryExport: 'default',
    },
};

module.exports = config;
