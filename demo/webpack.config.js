require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');
const ENGINE_DIR = path.resolve(__dirname, '../engine/src');
const isProd = process.env.NODE_ENV === 'production';

if (process.argv.includes('--watch')) {
    // eslint-disable-next-line global-require
    require('./server');
}

const babelInclude = [APP_DIR, ...(!isProd ? [ENGINE_DIR] : [])];

const config = {
    entry: `${APP_DIR}/index.jsx`,
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: babelInclude,
                loader: 'babel-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },
    output: {
        path: BUILD_DIR,
        filename: 'js/bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
    },
};

module.exports = config;
