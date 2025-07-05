import React from 'react';
import { render } from '@testing-library/react-native';
import IdlingBarChart from '../IdlingBarChart';

// 테마 색상 모킹
jest.mock('../../../theme/colors', () => ({
  CARBON_COLORS: {
    chart: {
      blue: '#4299E1',
    }
  }
}));

describe('IdlingBarChart Component', () => {
  // 테스트 데이터
  const mockEvents = [
    {
      id: '1',
      startTime: '2025-05-20T05:41:45Z',
      endTime: '2025-05-20T05:43:45Z',
      formattedStartTime: '05:41:45',
      formattedEndTime: '05:43:45',
      durationSeconds: 90,
    },
    {
      id: '2',
      startTime: '2025-05-20T06:15:30Z',
      endTime: '2025-05-20T06:19:30Z',
      formattedStartTime: '06:15:30',
      formattedEndTime: '06:19:30',
      durationSeconds: 240,
    }
  ];

  it('renders correctly with required props', () => {
    const { getByText } = render(
      <IdlingBarChart
        events={mockEvents}
        title="공회전 시간대 분석"
        score={85}
      />
    );

    // 제목이 올바르게 표시되는지 확인
    expect(getByText('공회전 시간대 분석')).toBeTruthy();
    
    // 이벤트 정보가 표시되는지 확인
    expect(getByText('구간 1')).toBeTruthy();
    expect(getByText('구간 2')).toBeTruthy();
    expect(getByText('05:41:45 ~ 05:43:45')).toBeTruthy();
    expect(getByText('06:15:30 ~ 06:19:30')).toBeTruthy();
    
    // 지속 시간이 표시되는지 확인
    expect(getByText('90.0초')).toBeTruthy();
    expect(getByText('240.0초')).toBeTruthy();
    
    // 2분 초과 시 감점 정보 메시지가 표시되는지 확인
    expect(getByText('* 2분 초과 시 30초당 5점 감점')).toBeTruthy();
  });

  it('handles totalIdlingMinutes prop when provided', () => {
    const { getAllByText } = render(
      <IdlingBarChart
        events={mockEvents}
        title="공회전 시간대 분석"
        totalIdlingMinutes={5.5}
        score={85}
      />
    );

    // 공회전 시간 데이터가 정확히 표시되는지 확인
    expect(getAllByText('구간 1').length).toBe(2); // 하나는 Y축 레이블, 하나는 시간 정보 영역
    expect(getAllByText('구간 2').length).toBe(2);
  });

  it('formats time correctly when formattedStartTime and formattedEndTime are missing', () => {
    const eventsWithoutFormattedTime = [
      {
        id: '1',
        startTime: '2025-05-20T05:41:45Z',
        endTime: '2025-05-20T05:43:45Z',
        durationSeconds: 90,
      }
    ];

    const { getByText } = render(
      <IdlingBarChart
        events={eventsWithoutFormattedTime}
        title="공회전 시간대 분석"
        score={85}
      />
    );

    // 시간 포맷팅이 올바르게 처리되는지 확인
    expect(getByText('05:41:45 ~ 05:43:45')).toBeTruthy();
  });

  it('handles events with missing duration information', () => {
    const eventsWithMissingDuration = [
      {
        id: '1',
        startTime: '2025-05-20T05:41:45Z',
        endTime: '2025-05-20T05:43:45Z',
      }
    ];

    const { getByText } = render(
      <IdlingBarChart
        events={eventsWithMissingDuration}
        title="공회전 시간대 분석"
        score={85}
      />
    );

    // 지속 시간이 0으로 표시되는지 확인
    expect(getByText('0.0초')).toBeTruthy();
  });

  it('displays penalty for duration over threshold (120 seconds)', () => {
    const { getByText } = render(
      <IdlingBarChart
        events={mockEvents}
        title="공회전 시간대 분석"
        score={85}
      />
    );

    // 두번째 이벤트(240초)는 임계값(120초) 초과하므로 감점이 표시되어야 함
    expect(getByText('-20')).toBeTruthy(); // 240-120=120초, 120초/30=4, 4*5=20점 감점
  });

  it('handles empty events array', () => {
    const { getByText } = render(
      <IdlingBarChart
        events={[]}
        title="빈 데이터"
        score={100}
      />
    );

    // 제목이 표시되는지 확인
    expect(getByText('빈 데이터')).toBeTruthy();
    expect(getByText('* 2분 초과 시 30초당 5점 감점')).toBeTruthy();
  });

  it('handles invalid time format gracefully', () => {
    const eventsWithInvalidTime = [
      {
        id: '1',
        startTime: 'invalid-time',
        endTime: 'invalid-time',
        durationSeconds: 90,
      }
    ];

    const { getByText } = render(
      <IdlingBarChart
        events={eventsWithInvalidTime}
        title="유효하지 않은 시간"
        score={85}
      />
    );

    // 기본 시간 포맷이 사용되는지 확인
    expect(getByText('유효하지 않은 시간')).toBeTruthy();
    expect(getByText('90.0초')).toBeTruthy();
  });
});