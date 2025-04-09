module.exports = {
    testMatch: [
        "**/tests/integration/*.test.ts",
        "**/tests/integration/**/*.test.ts",
        "**/tests/integration/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    collectCoverage: true,
    coverageDirectory: "coverage/integration",
    coverageReporters: ["text", "lcov"],
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    globalSetup: './tests/setup/globalSetup.ts',
    globalTeardown: './tests/setup/globalTeardown.ts',
  };