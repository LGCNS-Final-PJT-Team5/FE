# Modive 앱 차트 컴포넌트 요약

아래는 각 차트 컴포넌트의 기능과 필요한 props를 정리한 내용입니다:

## 데이터 시각화 차트

| 컴포넌트 이름 | 주요 기능 | 필수 Props | 선택적 Props |
|--------------|---------|-----------|------------|
| **CircleChart** | 원형 진행률 표시 | `percentage`: 표시할 퍼센트 값<br>`radius`: 원 반지름<br>`color`: 차트 색상 | - |
| **GaugeChart** | 반원형 게이지 차트 | `percentage`: 점수 표시값<br>`color`: 게이지 색상 | `size`: 크기(기본값: 180)<br>`gaugeBackgroundColor`: 배경색<br>`animated`: 애니메이션 여부<br>`animationDuration`: 애니메이션 시간 |
| **IdlingBarChart** | 공회전 시간 막대 차트 | `events`: 공회전 이벤트 배열<br>`title`: 차트 제목 | `totalIdlingMinutes`: 총 공회전 시간 |
| **TurningChart** | 회전 비율 원형 차트 | `data`: 회전 데이터<br>`title`: 차트 제목 | `pieRadius`: 파이 차트 크기<br>`pieInnerRadius`: 내부 원 크기 |
| **TimelineChart** | 이벤트 타임라인 시각화 | `events`: 이벤트 배열<br>`title`: 차트 제목 | `height`: 차트 높이<br>`showMarkers`: 마커 표시 여부 |
| **SpeedingChart** | 속도 라인 차트 | `data`: 속도 데이터<br>`title`: 차트 제목<br>`speedLimit`: 제한 속도 | `height`: 차트 높이<br>`width`: 차트 너비 |
| **SpeedDistributionPieChart** | 속도 분포 파이 차트 | `data`: 속도 분포 데이터<br>`title`: 차트 제목 | `pieRadius`: 차트 크기<br>`pieInnerRadius`: 내부 원 크기 |
| **SafeDistanceChart** | 차간 거리 변화 시각화 | `events`: 차간 거리 이벤트 | `height`: 차트 높이 |
| **ReactionSpeedChart** | 반응 속도 그래프 | `events`: 반응 시간 이벤트 | `height`: 차트 높이 |
| **LaneDepartureChart** | 차선 이탈 시각화 | `events`: 차선 이탈 이벤트 | `height`: 차트 높이 |
| **AccelerationChart** | 가속/감속 막대 차트 | `data`: 가속 데이터<br>`title`: 차트 제목<br>`height`: 차트 높이 | - |

## 정보 표시 컴포넌트

| 컴포넌트 이름 | 주요 기능 | 필수 Props | 선택적 Props |
|--------------|---------|-----------|------------|
| **ReportHeaderSection** | 보고서 헤더 | `score`: 점수<br>`onBackPress`: 뒤로가기 함수<br>`screenType`: 화면 유형 | `filterOptions`: 필터 옵션<br>`onFilterChange`: 필터 변경 함수<br>`selectedFilter`: 선택된 필터 |
| **FeedbackMessage** | 운전 피드백 메시지 | `message`: 피드백 내용 | `title`: 피드백 제목<br>`screenType`: 화면 유형 |
| **EventsList** | 이벤트 목록 표시 | `events`: 이벤트 배열<br>`title`: 목록 제목 | `showDuration`: 지속 시간 표시 여부 |
| **DrivingTimePanel** | 운전 시간 정보 | `session`: 운전 세션<br>`score`: 점수<br>`colors`: 색상 테마 | - |
| **InactivityPanel** | 미조작 정보 패널 | `events`: 미조작 이벤트<br>`score`: 점수<br>`colors`: 색상 테마 | - |
| **ScoreCard** | 점수 카드 표시 | `score`: 점수 데이터<br>`bgColor`: 배경 색상<br>`onPress`: 클릭 핸들러 | - |
| **DetailHeader** | 상세 화면 헤더 | `title`: 헤더 제목<br>`onClose`: 닫기 함수 | - |
| **DrivingHistoryItem** | 주행 기록 항목 | `item`: 주행 기록<br>`onPress`: 클릭 핸들러 | - |
| **DrivingHistoryChart** | 주행 기록 추이 그래프 | - | - |

## 데이터 타입 예시

```typescript
// 공회전 이벤트
interface IdlingEvent {
  id?: string;
  startTime: string;  // 시작 시간 (ISO 형식)
  endTime: string;    // 종료 시간 (ISO 형식)
  durationMinutes?: number; // 지속 시간(분)
}

// 속도 분포 데이터
interface SpeedMaintainItem {
  value: number;      // 백분율 값
  color: string;      // 색상
  label: string;      // 구간 레이블 (예: "0-30km/h")
}

// 운전 세션
interface DrivingSession {
  durationHours: number;      // 운전 시간(시간)
  formattedStartTime: string; // 시작 시간 (포맷팅됨)
  formattedEndTime: string;   // 종료 시간 (포맷팅됨)
  progress: number;           // 진행률 (0-1)
}
```

이 차트 컴포넌트들은 운전 데이터를 다양한 형태로 시각화하여 사용자가 운전 습관과 안전 점수를 쉽게 이해할 수 있도록 도와줍니다.