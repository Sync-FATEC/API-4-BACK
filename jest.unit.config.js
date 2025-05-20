module.exports = {
    testMatch: [
        "**/tests/unit/*.test.ts",
        "**/tests/unit/**/*.test.ts",
        "**/tests/unit/**/**/*.test.ts",
      ],
    testPathIgnorePatterns: ["/node_modules/"],
    testEnvironment: "node",
    moduleNameMapper: {
      "^@/(.)$": "<rootDir>/src/$1",
    },
    preset: "ts-jest",
  };