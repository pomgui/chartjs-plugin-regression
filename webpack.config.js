const path = require('path');
const pck = require('./package.json');

module.exports = (env, argv) => {
  const config = {
    entry: './lib/index.js',
    mode: 'development',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'chartjs-plugin-regression-' + pck.version + '.js'
    }
  };

  if (argv.mode == 'production') {
    Object.assign(config, {
      mode: 'production',
      devtool: undefined,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['source-map-loader'],
            enforce: 'pre'
          }
        ]
      }
    });
  }

  return config;
};
