module.exports = {
    testMatch: [
        "**/tests/integration/*.test.ts",
        "**/tests/integration/**/*.test.ts",
        "**/tests/integration/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    coverageDirectory: "coverage/integration",
    coverageReporters: ["text", "lcov"],
    collectCoverage: true,
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
    globalSetup: './tests/integration/config/setup/SetupIntegration.ts',
    globalTeardown: './tests/integration/config/setup/TeardownIntegration.ts',
    testTimeout: 60000,
  };