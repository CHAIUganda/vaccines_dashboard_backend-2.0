//less
//angular
//js
var path = require('path');
var webpack = require('webpack')
module.exports = {
    watch: true,
    eslint: {
        emitError: true,
        failOnWarning: true,
        failOnError: true
    },
    entry: {
        charts: "./charts.entry.js",
        scores: "./scores.entry.js",
    },
    output: {
        path: path.join(__dirname, "dashoard/static/dist"),
        filename: "[name].bundle.js",
        publicPath: "/static/dist/"
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: "style!css!less"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.png$/,
            loader: "url-loader?limit=100000"
        }, {
            test: /\.jpg$/,
            loader: "file-loader"
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'file-loader'
        }, {
            test: /\.js$/,
            loader: "eslint-loader",
            exclude: [/node_modules/, /vendor/]
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        alias: {
            jquery: "jquery/dist/jquery.js",
            'datatables.net': "datatables/media/js/jquery.dataTables.js",
        },
        modulesDirectories: ['dashboard/static/vendor', 'dashboard/static/js', 'dashboard/static/css']
    }
};