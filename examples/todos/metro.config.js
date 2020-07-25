const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  resolver: {
    blacklistRE: blacklist([/^src[/\\].*/])
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
}
