// jest.config.cjs

const { tr } = require("@faker-js/faker");

/** @type {import('jest').Config} */
module.exports = {
  // use the ESM‐aware preset
  preset: "ts-jest/presets/default-esm",

  // run tests in Node
  testEnvironment: "node",

  // ← this resolver will rewrite YOUR foo.js → foo.ts imports
  resolver: require.resolve("ts-jest-resolver"),

  // treat your TS files as ESM ('.js' is inferred)
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
  moduleFileExtensions: [
    "ts",
    "tsx", // your sources & tests
    "js",
    "jsx", // any JS you import locally
    "json",
    "node",
  ],

  // make sure node_modules stay out of your transforms
  transformIgnorePatterns: ["/node_modules/"],
};
