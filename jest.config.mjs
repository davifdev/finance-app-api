/** @type {import('jest').Config} */

const config = {
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
};

export default config;
