const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  clearMocks: true,
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // Use Babel for all module transformations
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(.*@clerk.*))", // Ensure Clerk modules are transformed
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@clerk/nextjs$": "<rootDir>/__mocks__/@clerk/nextjs.ts",
    "^@/app/utils/actions$": "<rootDir>/__mocks__/app/utils/actions.ts",
  },
};

module.exports = createJestConfig(customJestConfig);
