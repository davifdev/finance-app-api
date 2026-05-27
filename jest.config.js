/** @type {import('jest').Config} */

const config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!@faker-js/)"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  collectCoverageFrom: ["src/**/*.js"],
  testPathIgnorePatterns: ["<rootDir>/src/__tests__"],
  globalSetup: "<rootDir>/jest.global-setup.mjs",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

export default config;
