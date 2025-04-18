module.exports = {
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/**/*.test.ts",
    "**/tests/**/**/**/*.test.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  preset: "ts-jest",
  globalSetup: './tests/integration/setup/SetupIntegration.ts',
  globalTeardown: './tests/integration/setup/TeardownIntegration.ts',
  testTimeout: 30000, // <- Adicionado para evitar timeouts
};