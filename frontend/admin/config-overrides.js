const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "process": require.resolve("process/browser") // Keep this line
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser', // Fix this line
    }),
  ];

  return config;
};