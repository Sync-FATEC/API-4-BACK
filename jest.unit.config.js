module.exports = {
    testMatch: [
        "**/tests/**/*.test.ts",
        "**/tests/**/**/*.test.ts",
        "**/tests/**/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    collectCoverage: true,
    coverageDirectory: "coverage/unit",
    coverageReporters: ["text", "lcov"],
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
  };