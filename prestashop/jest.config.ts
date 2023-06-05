import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  roots: ['<rootDir>/src'],
  verbose: true,
  preset: 'ts-jest',
};

export default config;
