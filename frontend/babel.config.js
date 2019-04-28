module.exports = function(api) {
  api.cache(false);

  const plugins = [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-class-properties', { "loose": true }],
    '@babel/transform-runtime'
  ];

  const presets = [
    'babel-preset-expo',  "@babel/preset-env", "@babel/preset-react"
  ];

  return {
    plugins,
    presets,
  };
};
