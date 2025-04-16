module.exports = {
    testMatch: [
        "**/tests/integration/*.test.ts",
        "**/tests/integration/**/*.test.ts",
        "**/tests/integration/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    coverageDirectory: "coverage/integration",
    coverageReporters: ["text", "lcov"],
    collectCoverage: false,
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    globalSetup: './tests/integration/setup/SetupIntegration.ts',
    globalTeardown: './tests/integration/setup/TeardownIntegration.ts',
    testTimeout: 60000,
  };