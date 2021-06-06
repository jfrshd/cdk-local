module.exports = {
  displayName: "jest-js",
  roots: ["<rootDir>/test", "<rootDir>/lib/models"],
  testMatch: ["**/*.test.ts", "**/*.test.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(crypto-random-string)/)"],

  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  globals: {
    "ts-jest": {
      tsConfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
  // verbose: true,
  globalSetup: "<rootDir>/test/jest/start.js",
  globalTeardown: "<rootDir>/test/jest/end.js",
};
