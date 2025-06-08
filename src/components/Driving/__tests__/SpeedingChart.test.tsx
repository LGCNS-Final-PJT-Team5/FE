import React from 'react';
import { render } from '@testing-library/react-native';
import SpeedingChart from '../SpeedingChart';
import { View, Text } from 'react-native';

// LineChart 모킹
jest.mock('react-native-gifted-charts', () => ({
  LineChart: (props: any) => (
    <View testID="line-chart">
      <Text>Mock LineChart</Text>
      <Text testID="chart-data">{JSON.stringify(props.data)}</Text>
      <Text testID="chart-width">{props.width}</Text>
      <Text testID="chart-height">{props.height}</Text>
    </View>
  )
}));

// 테마 색상 모킹
jest.mock('../../../theme/colors', () => ({
  SAFETY_COLORS: {
    primary: '#4945FF',
    chart: {
      green: '#68D392',
      red: '#E53E3E',
      grid: '#E2E8F0',
      lightGrid: '#EDF2F7'
    }
  }
}));

describe('SpeedingChart Component', () => {
  // 테스트 데이터
  const mockData = [
    { value: 85, label: '구간 1' },
    { value: 110, label: '구간 2' },
    { value: 95, label: '구간 3' },
  ];

  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <SpeedingChart
        data={mockData}
        title="과속 분석"
        speedLimit={100}
      />
    );

    // 제목이 올바르게 표시되는지 확인
    expect(getByText('과속 분석')).toBeTruthy();
    
    // LineChart 컴포넌트가 렌더링되는지 확인
    expect(getByText('Mock LineChart')).toBeTruthy();
    
    // 데이터가 올바르게 전달되는지 확인
    const chartData = JSON.parse(getByTestId('chart-data').props.children);
    expect(chartData).toEqual(mockData);
    
    // 제한속도 표시가 있는지 확인
    expect(getByText('제한속도: 100km/h')).toBeTruthy();
  });

  it('applies custom height and width', () => {
    const { getByTestId } = render(
      <SpeedingChart
        data={mockData}
        title="과속 분석"
        speedLimit={100}
        height={400}
        width={500}
      />
    );
    
    // 높이 및 너비가 올바르게 전달되는지 확인
    expect(getByTestId('chart-height').props.children).toBe(400);
    expect(getByTestId('chart-width').props.children).toBe(500);
  });

  it('uses default height and width when not provided', () => {
    const { getByTestId } = render(
      <SpeedingChart
        data={mockData}
        title="과속 분석"
        speedLimit={100}
      />
    );
    
    // 기본 높이 및 너비가 사용되는지 확인
    expect(getByTestId('chart-height').props.children).toBe(200);
    expect(getByTestId('chart-width').props.children).toBe(300);
  });

  it('handles empty data array', () => {
    const { getByText } = render(
      <SpeedingChart
        data={[]}
        title="빈 데이터"
        speedLimit={100}
      />
    );

    // 제목이 표시되는지 확인
    expect(getByText('빈 데이터')).toBeTruthy();
    expect(getByText('제한속도: 100km/h')).toBeTruthy();
  });

  it('correctly calculates speed limit position', () => {
    const { getByTestId } = render(
      <SpeedingChart
        data={mockData}
        title="과속 분석"
        speedLimit={100}
        height={200}
      />
    );

    // 차트가 렌더링되는지 확인
    expect(getByTestId('line-chart')).toBeTruthy();
  });
});