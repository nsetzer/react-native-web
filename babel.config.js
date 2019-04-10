module.exports = function(api) {
  api.cache(true);

  const plugins = [
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-class-properties'],
    ['@babel/transform-runtime']
  ];

  const presets = [
    'babel-preset-expo',
  ];

  return {
    plugins,
    presets,
  };
};
