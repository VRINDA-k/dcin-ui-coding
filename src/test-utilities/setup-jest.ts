import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly scrollMargin = '';
  readonly thresholds: readonly number[] = [];

  disconnect = jest.fn();
  observe = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

beforeEach(() => {
  jest.clearAllMocks();
});

const originalConsoleError = console.error;

beforeAll(() => {
  console.error = (message: string) => {
    if (ignoredTestErrors.some((ignored) => String(message).includes(ignored))) {
      return;
    }

    throw new Error(
      `Errors in console are not allowed in a unit test run, hence manually failing this test case. Error: ${message}`,
    );
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

export const ignoredTestErrors: string[] = [];
