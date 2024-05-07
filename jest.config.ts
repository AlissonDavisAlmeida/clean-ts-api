
import type { Config } from 'jest';
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
const config: Config = {
  roots: [
    '<rootDir>/src'
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: [
    '<rootDir>/src'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  preset: "@shelf/jest-mongodb"
};

export default config;
