// bootstrap
const ENV = process.env;
ENV.ROOT = __dirname;
if (ENV.NODE_ENV !== 'production') {
    let config;
    if (ENV.NODE_ENV === 'stage') {
        config = {
            path: '.env.stage',
        };
    } else {
        config = {};
    }
    require('dotenv').config(config);
}
const mode = (!ENV.NODE_ENV || ENV.NODE_ENV === 'production') ? 'production' : 'development';
console.log(`webpack env is: "${ENV.NODE_ENV}", so mode is set to "${mode}"`);
const PKG = require(ENV.ROOT + '/package.json');

// deps
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// export
module.exports = {
    mode,
    devtool: 'inline-source-map',
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({ // for bootstrap
            $: "jquery",
            jQuery: "jquery",
        }),

        new webpack.DefinePlugin({
            ENV: JSON.stringify(ENV),
            PKG: JSON.stringify(PKG),
            'process.env': { // this is for vuejs
                NODE_ENV: JSON.stringify(ENV.VUE_ENV ? ENV.VUE_ENV : 'production'),
            },
        }),

        // new ManifestPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // new webpack.HashedModuleIdsPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        // }),
        // manifest must be last!
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest',
        // }),

        // hot (can't figure out how to work it)
        // new webpack.NamedModulesPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
        // filename: '[name].[chunkhash].js',
        publicPath: '/',
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader",
            }, {
                loader: "css-loader",
            }],
        }, {
            test: /\.scss$/,
            use: [{
                loader: "style-loader",
            }, {
                loader: "css-loader",
            }, {
                loader: "sass-loader",
            }],
        }, {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            type: 'asset/resource',
        }],
    },
};
