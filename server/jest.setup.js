import { jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

// Mock the prisma module globally before tests run
jest.mock('./src/config/prisma.js', () => ({
  __esModule: true,
  prisma: mockDeep(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
