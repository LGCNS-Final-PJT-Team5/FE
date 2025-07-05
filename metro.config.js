const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// svg 처리를 위한 설정 추가
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
};

// 사용자 정의 config가 있으면 여기에 병합 가능
const customConfig = {};

module.exports = mergeConfig(defaultConfig, customConfig);
