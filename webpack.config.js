var path = require('path');
var webpack = require('webpack');
var srcDir = '/assets';
var distDir = 'public/dist';

module.exports = {
    context: __dirname + srcDir,
    entry: {
        app: './js/index'
    },
    output: {
        path: path.join(__dirname, distDir),
        filename: 'js/[name].js',
        publicPath: distDir + '/'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel'],
                include: path.join(__dirname, srcDir)
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules']
    },
};
