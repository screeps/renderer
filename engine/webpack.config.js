/**
 * Created by vedi on 05/04/2017.
 */

require('webpack');
const path = require('path');

const libraryName = 'renderer';
const plugins = [];

const outputFile = `${libraryName}.js`;

const config = {
    entry: `${__dirname}/src/index.js`,
    devtool: 'source-map',
    output: {
        path: `${__dirname}/dist`,
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
            {
                test: /(\.js)$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            'node_modules',
        ],
    },
    plugins,
};

module.exports = config;
