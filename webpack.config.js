var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    resolve: {
        root: [
            './app'
        ],
        modulesDirectories: ["node_modules", "client"]
    },
    devtool: 'sourcemap',
    entry: ['bootstrap-loader', './app/scripts/app.js'],
    module: {
        loaders: [
            {test: /\.js$/, exclude: [/app\/bower_components/, /node_modules/], loader: 'ng-annotate'},
            {test: /\.js$/, include: [/app\/bower_components/, /node_modules/], loader: 'ng-annotate'},
            {test: /\.html$/, include: [/client/], loader: 'ngtemplate?relativeTo=/client/!raw'},

//      {test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel'},
//            {test: /\.html$/, loader: 'raw'},
            {test: /\.png$/, loader: 'url'},
            {test: /\.styl$/, loader: 'style!css!stylus'},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader","css-loader")},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"}
        ]
    },
    plugins:[ 
        new ExtractTextPlugin("[name].css"),
        // Injects bundles in your index.html instead of wiring all manually.
        // It also adds hash to all injected assets so we don't have problems
        // with cache purging during deployment.
        new HtmlWebpackPlugin({
            template: 'app/index.html',
            inject: 'body',
            hash: true
        }),

        // Automatically move all modules defined outside of application directory to vendor bundle.
        // If you are using more complicated project structure, consider to specify common chunks manually.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                return module.resource && module.resource.indexOf(path.resolve(__dirname, 'app/bower_components')) === -1;
            }
        })
    ],
    sassLoader: {
        includePaths: [path.resolve(__dirname, "./app/bower_components"), path.resolve(__dirname, "./app")]
    }
};
