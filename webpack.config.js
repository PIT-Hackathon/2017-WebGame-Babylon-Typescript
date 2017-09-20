var path = require('path')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, 'src/Game.ts')
        ]
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'game.js'
    },
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 9000,
            server: {
                baseDir: ['./', './build']
            }
        })
    ],
    module: {
        rules: [
            { test: /\.json$/i, loader: 'json-loader' },
			{ test: /\.ts$/i, loader: 'awesome-typescript-loader', exclude: nodeModulesDir }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
		extensions: ['.ts', '.js'],
		modules: [srcDir, nodeModulesDir],
	}
}
