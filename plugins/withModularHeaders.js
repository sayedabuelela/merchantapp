const { withPodfile } = require('expo/config-plugins');

/**
 * Adds `use_modular_headers!` to the Podfile.
 * Required for Firebase Swift pods that depend on libraries without module maps.
 */
module.exports = function withModularHeaders(config) {
  return withPodfile(config, (podfileConfig) => {
    const contents = podfileConfig.modResults.contents;

    if (!contents.includes('use_modular_headers!')) {
      podfileConfig.modResults.contents = contents.replace(
        /platform :ios.*\n/,
        (match) => `use_modular_headers!\n${match}`,
      );
    }

    return podfileConfig;
  });
};
