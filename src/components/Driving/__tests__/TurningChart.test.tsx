import React from 'react';
import { render } from '@testing-library/react-native';
import TurningChart from '../TurningChart';
import { View, Text } from 'react-native';

// 올바른 모킹 방식
jest.mock('react-native-gifted-charts', () => ({
  PieChart: 'View', // JSX를 사용하지 않고 문자열로 대체
  LineChart: 'View',
  BarChart: 'View'
}));

// 테마 색상 모킹
jest.mock('../../../theme/colors', () => ({
  SAFETY_COLORS: {
    chart: {
      grid: '#E2E8F0'
    }
  }
}));

describe('TurningChart Component', () => {
  // 테스트 데이터
  const mockData = [
    { value: 80, color: '#68D392', name: '정상 회전' },
    { value: 20, color: '#E53E3E', name: '급회전' }
  ];

  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <TurningChart
        data={mockData}
        title="급회전 분석"
      />
    );

    // 제목이 올바르게 표시되는지 확인
    expect(getByText('급회전 분석')).toBeTruthy();
    
    // PieChart 컴포넌트가 렌더링되는지 확인
    expect(getByText('Mock PieChart')).toBeTruthy();
    
    // 데이터가 올바르게 전달되는지 확인
    const chartData = JSON.parse(getByTestId('chart-data').props.children);
    expect(chartData).toEqual(mockData);
    
    // 중앙 레이블이 렌더링되는지 확인
    const centerLabel = getByTestId('center-label');
    expect(centerLabel).toBeTruthy();
    expect(getByText('회전 비율')).toBeTruthy();
    
    // 범례가 올바르게 표시되는지 확인
    expect(getByText('정상 회전')).toBeTruthy();
    expect(getByText('급회전')).toBeTruthy();
  });

  it('applies custom pieRadius and pieInnerRadius props', () => {
    const { getByTestId } = render(
      <TurningChart
        data={mockData}
        title="급회전 분석"
        pieRadius={150}
        pieInnerRadius={75}
      />
    );
    
    // 반지름 값이 올바르게 전달되는지 확인
    expect(getByTestId('chart-radius').props.children).toBe(150);
    expect(getByTestId('chart-inner-radius').props.children).toBe(75);
  });

  it('uses default pieRadius and pieInnerRadius when not provided', () => {
    const { getByTestId } = render(
      <TurningChart
        data={mockData}
        title="급회전 분석"
      />
    );
    
    // 기본 반지름 값이 사용되는지 확인
    expect(getByTestId('chart-radius').props.children).toBe(120);
    expect(getByTestId('chart-inner-radius').props.children).toBe(60);
  });

  it('handles empty data array', () => {
    const { getByText, queryByText } = render(
      <TurningChart
        data={[]}
        title="빈 데이터"
      />
    );

    // 제목이 표시되는지 확인
    expect(getByText('빈 데이터')).toBeTruthy();
    
    // 데이터가 없으므로 범례 항목이 없어야 함
    expect(queryByText('정상 회전')).toBeNull();
    expect(queryByText('급회전')).toBeNull();
  });

  it('renders correctly with a single data item', () => {
    const singleData = [
      { value: 100, color: '#68D392', name: '정상 회전' }
    ];

    const { getByText } = render(
      <TurningChart
        data={singleData}
        title="단일 데이터"
      />
    );

    // 제목이 표시되는지 확인
    expect(getByText('단일 데이터')).toBeTruthy();
    
    // 단일 범례 항목이 표시되는지 확인
    expect(getByText('정상 회전')).toBeTruthy();
  });
});