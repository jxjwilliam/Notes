/**
 * for data.json:
 * in karma/jasmine/es6:
    x: use require(path.resolve...) not work.
    x: karma-fixture-loader not work
   ok: use webpack json-loader: npm install --save-dev json-loader
 */
var path = require('path');
module.exports = function (config) {
    config.set({

        plugins: ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-webpack'],
        basePath: './',
        browsers: ['PhantomJS'],
        files: [
            {
                pattern: './spec-context.js',
                watched: false
            }
        ],
        exclude: [],
        frameworks: ['jasmine'],
        preprocessors: {
            'spec-context.js': ['webpack']
        },
        webpack: {
            resolve: {
              alias: {
                  app: path.join(__dirname, 'agents')
              }
            },
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel'
                    },{
                        test: /\.json$/,
                        loader: 'json-loader',
                    }
                ]
            },
            watch: true
        },
        webpackServer: {noInfo: true}
    });
};

/**
 * then in agents.spec.js:
 * import demoDate from './agents.json';
 *
 */