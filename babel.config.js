module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'add-react-displayname',
      './node_modules/@heap/react-native-heap/instrumentor/src/index.js'
    ],
  };
};
