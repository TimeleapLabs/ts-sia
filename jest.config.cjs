// jest.config.cjs

const { tr } = require("@faker-js/faker");

/** @type {import('jest').Config} */
module.exports = {
  // ESM‐aware preset
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  // will rewrite .js → .ts imports
  resolver: require.resolve("ts-jest-resolver"),

  // treat TS files as ESM ('.js' is inferred)
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // compile .ts, .tsx, and local .js via ts-jest in ESM mode
  transform: {
    "^.+\\.(ts|tsx|js)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
        isolatedModules: true,
      },
    ],
  },

  // these are the file extensions Jest will look for
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // node_modules stay out of transforms
  transformIgnorePatterns: ["/node_modules/"],
};
