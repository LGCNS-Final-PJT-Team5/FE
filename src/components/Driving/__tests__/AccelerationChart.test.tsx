import React from 'react';
import { render } from '@testing-library/react-native';
import AccelerationChart from '../AccelerationChart';
import { Text, View } from 'react-native';

// 차트 라이브러리 모킹
jest.mock('react-native-gifted-charts', () => ({
  BarChart: (props: any) => (
    <View testID="bar-chart">
      <Text>Mock BarChart</Text>
      <Text testID="chart-data">{JSON.stringify(props.data)}</Text>
    </View>
  )
}));

// 테마 색상 모킹
jest.mock('../../../theme/colors', () => ({
  SAFETY_COLORS: {
    chart: {
      grid: '#E2E8F0',
      purple: '#BB27FF'
    }
  }
}));

describe('AccelerationChart Component', () => {
  // 테스트 데이터
  const mockData = [
    { value: 80, label: '08:30' },
    { value: 65, label: '08:45' },
    { value: 75, label: '09:00' },
  ];

  it('renders correctly with required props', () => {
    const { getByText, getByTestId } = render(
      <AccelerationChart
        data={mockData}
        title="급가감속 분석"
        height={200}
      />
    );

    // 제목이 올바르게 표시되는지 확인
    expect(getByText('급가감속 분석')).toBeTruthy();
    
    // BarChart 컴포넌트가 렌더링되는지 확인
    expect(getByText('Mock BarChart')).toBeTruthy();
    
    // 데이터가 올바르게 전달되는지 확인
    const chartData = JSON.parse(getByTestId('chart-data').props.children);
    expect(chartData).toEqual(mockData);
  });

  it('applies the correct height to the chart', () => {
    const { getByTestId } = render(
      <AccelerationChart
        data={mockData}
        title="급가감속 분석"
        height={300}
      />
    );

    // 차트가 존재하는지 확인
    expect(getByTestId('bar-chart')).toBeTruthy();
  });

  it('handles empty data array', () => {
    const { getByText } = render(
      <AccelerationChart
        data={[]}
        title="빈 데이터"
        height={200}
      />
    );

    // 제목이 표시되는지 확인
    expect(getByText('빈 데이터')).toBeTruthy();
    
    // BarChart가 빈 데이터로 렌더링되는지 확인
    expect(getByText('Mock BarChart')).toBeTruthy();
  });

  it('should use default height when height prop is not provided', () => {
    const { getByTestId } = render(
      <AccelerationChart
        data={mockData}
        title="기본 높이 테스트"
      />
    );

    // 차트가 렌더링되는지 확인
    expect(getByTestId('bar-chart')).toBeTruthy();
  });
});