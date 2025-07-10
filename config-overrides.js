const webpack = require('webpack');

module.exports = function override(config) {
  // Add fallbacks for node core modules
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "url": require.resolve("url"),
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "process": require.resolve("process/browser"),
    "util": require.resolve("util"),
    "buffer": require.resolve("buffer"),
    "querystring": require.resolve("querystring-es3"),
    "events": require.resolve("events/"),
    "vm": require.resolve("vm-browserify"),
    "fs": false,
    "net": false,
    "tls": false,
    "child_process": false,
    "http2": false
  };

  // Modify the webpack config
  config.resolve = {
    ...config.resolve,
    fallback,
    alias: {
      ...config.resolve.alias,
      "process": "process/browser",
      "util": require.resolve("util"),
      "events": require.resolve("events"),
      "vm": require.resolve("vm-browserify"),
      "google-logging-utils": false // Disable google-logging-utils in browser
    }
  };

  // Add plugins
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.NormalModuleReplacementPlugin(
      /node:(.+)$/,
      (resource) => {
        const mod = resource.request.replace(/^node:/, '');
        switch (mod) {
          case 'events':
            resource.request = 'events';
            break;
          case 'util':
            resource.request = 'util';
            break;
          case 'process':
            resource.request = 'process/browser';
            break;
          case 'vm':
            resource.request = 'vm-browserify';
            break;
          default:
            throw new Error(`Unknown node: import ${mod}`);
        }
      }
    )
  ];

  return config;
}; 