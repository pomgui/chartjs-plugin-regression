const path = require('path');

module.exports = {
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chartjs-plugin-regression.js'
  },
  mode: 'production',
  devtool: 'source-map'
};
