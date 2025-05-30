export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.mjs'],
  transform: {},
  transformIgnorePatterns: ['node_modules/(?!(your-esm-packages)/)'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.css$': 'identity-obj-proxy'  
  },
};
