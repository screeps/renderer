/**
 * Created by vedi on 05/04/2017.
 */

const path = require('path');

const libraryName = 'renderer';
const plugins = [];

const outputFile = `${libraryName}.js`;

const config = {
    entry: `${__dirname}/src/index.js`,
    mode: 'production',
    devtool: 'source-map',
    output: {
        path: `${__dirname}/dist`,
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
    },
    module: {
        rules: [
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
        fallback: {
            path: require.resolve('path-browserify'),
            url: require.resolve('url'),
        },
    },
    plugins: [
        ...plugins
        // ESLintPlugin removed due to FlatESLint error
    ],
};

module.exports = config;
