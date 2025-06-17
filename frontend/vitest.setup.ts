import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(vi.fn());
  window.URL.createObjectURL = (file: File) => file.name;

  // Mantine needed mocks
  // see: https://mantine.dev/guides/vitest/
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);
  window.HTMLElement.prototype.scrollIntoView = () => {};

  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  cleanup();
});
