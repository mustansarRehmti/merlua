const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {resolver: {
    // Force the file watcher to completely ignore transient native Android build paths
    blockList: [
      /.*\/android\/\.cxx\/.*/,
      /.*\/android\/build\/.*/,
      /node_modules\/.*\/android\/\.cxx\/.*/
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
