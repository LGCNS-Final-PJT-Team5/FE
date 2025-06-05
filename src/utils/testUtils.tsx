import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Mock data factories
export const createMockAccidentPreventionData = (overrides = {}) => ({
  score: 85,
  reaction: {
    score: 80,
    feedback: '반응속도가 양호합니다.',
    graph: ['2024-01-01T10:00:00Z', '2024-01-01T10:30:00Z'],
  },
  laneDeparture: {
    score: 90,
    feedback: '차선 유지가 우수합니다.',
    graph: ['2024-01-01T10:15:00Z'],
  },
  followingDistance: {
    score: 85,
    feedback: '안전거리 유지가 양호합니다.',
    graph: ['2024-01-01T10:20:00Z', '2024-01-01T10:45:00Z'],
  },
  ...overrides,
});

export const createMockNavigationProps = (overrides = {}) => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  ...overrides,
});

export const createMockRouteProps = (overrides = {}) => ({
  params: {},
  key: 'test-route',
  name: 'TestScreen',
  ...overrides,
});

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options);

export * from '@testing-library/react-native';
export { customRender as render };
