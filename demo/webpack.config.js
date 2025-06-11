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
    mode: 'development',
    devtool: 'source-map',
    entry: `${APP_DIR}/index.jsx`,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: babelInclude,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread',
                        ],
                    },
                },
            },
        ],
    },
    output: {
        path: BUILD_DIR,
        filename: 'js/bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        fallback: {
            path: require.resolve('path-browserify'),
        },
    },
};

module.exports = config;
