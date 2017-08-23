const path = require ('path');
const {BannerPlugin} = require ('webpack');
const UglifyJSPlugin = require ('uglifyjs-webpack-plugin');
const lib = require ('./package.json');

const LIBRARY_NAME = lib.name;
const LIBRARY_VERSION = lib.version;
const LIBRARY_DESCRIPTION = lib.description;
const LIBRARY_BANNER = `React xStore JavaScript Library v${LIBRARY_VERSION}
${LIBRARY_DESCRIPTION}
https://github.com/tamerzorba/react-xstore

Copyright ©2017 Tamer Zorba and other contributors
Released under the MIT license
https://opensource.org/licenses/MIT`;

const PATHS = {
  app: path.join (__dirname, 'src'),
  build: path.join (__dirname, 'dist'),
};

module.exports = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [new BannerPlugin (LIBRARY_BANNER), new UglifyJSPlugin ()],
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
};
