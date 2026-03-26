const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// react-native-css-interop のキャッシュを完全に除外
config.resolver.blockList = [
  // react-native-css-interop のキャッシュディレクトリを除外
  /node_modules\/react-native-css-interop\/.cache\/.*/,
  // その他のキャッシュ
  /node_modules\/.*\/.cache\/.*/,
  /node_modules\/.*\/\.vite\/.*/,
  /\.expo\/.*/,
];

// Windows で問題が発生する場合
if (process.platform === 'win32') {
  config.maxWorkers = 1;
  config.watchman = false;
}

module.exports = config;