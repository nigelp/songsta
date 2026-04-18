module.exports = {
  packagerConfig: {
    name: 'Songsta',
    icon: 'public/favicon',
    asar: true,
    osxSign: false,
  },
  publishers: [],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        format: 'ULFO',
      },
    },
  ],
};