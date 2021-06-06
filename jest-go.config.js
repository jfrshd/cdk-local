module.exports = {
  displayName: "jest-go",
  runner: "jest-runner-go",
  moduleFileExtensions: ["go"],
  roots: ["<rootDir>/lib/models"],
  testMatch: ["**/*_test.go"],
  verbose: true,
};
