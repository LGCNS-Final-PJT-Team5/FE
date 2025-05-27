import { TimeEvent, TimeRangeEvent } from './driving';

// 리포트 유형
export type ReportType = 'accident' | 'safety' | 'carbon' | 'attention';

// 사고 예방 리포트 처리된 데이터 타입
export interface ProcessedAccidentReport {
  score: number;
  reactionScore: number;
  laneDepartureScore: number;
  followingDistanceScore: number;
  reactionFeedback: string;
  laneDepartureFeedback: string;
  followingDistanceFeedback: string;
  reactionEvents: TimeRangeEvent[];
  laneDepartureEvents: TimeEvent[];
  followingDistanceEvents: TimeRangeEvent[];
}

// 보고서 관련 타입 정의
export interface ReactionEventData {
  startTime: string;
  endTime: string;
}

export interface ReactionTimelineEvent {
  id: string;
  time: string;
  formattedTime: string;
  endTime: string;
  formattedEndTime: string;
  duration: number;
}

export interface LaneDepartureEvent {
  id: string;
  time: string;
  formattedTime: string;
}

export interface FollowingDistanceEvent {
  id: string;
  time: string;
  formattedTime: string;
  endTime: string;
  formattedEndTime: string;
  duration: number;
}

export interface AccidentPreventionData {
  score: number;
  reaction: {
    score: number;
    feedback: string;
    graph: ReactionEventData[];
  };
  laneDeparture: {
    score: number;
    feedback: string;
    graph: string[];
  };
  followingDistance: {
    score: number;
    feedback: string;
    graph: ReactionEventData[];
  };
}

export type AccidentPreventionTab = '반응속도' | '차선이탈' | '안전거리유지';

// 주의력 점수 보고서 관련 타입
export interface AttentionScoreData {
  score: number;
  drivingTime: {
    score: number;
    feedback: string;
    graph: {
      startTime: string;
      endTime: string;
    }[];
  };
  inactivity: {
    score: number;
    feedback: string;
    graph: string[];
  };
}

// 주행 세션 타입
export interface DrivingSession {
  id: number;
  startTime: string;
  endTime: string;
  formattedStartTime: string;
  formattedEndTime: string;
  durationMinutes: number;
  durationHours: number;
  progress: number;
}

// 미조작 이벤트 타입
export interface InactivityEvent {
  id: number;
  time: string;
  formattedTime: string;
}

// 주의력 점수 처리된 데이터 타입
export interface ProcessedAttentionReport {
  score: number;
  drivingTimeScore: number;
  inactivityScore: number;
  drivingTimeFeedback: string;
  inactivityFeedback: string;
  drivingTimeSessions: DrivingSession[];
  inactivityEvents: InactivityEvent[];
}

// 탄소 배출 보고서 관련 타입
export interface CarbonEmissionData {
  score: number;
  idling: {
    score: number;
    feedback: string;
    graph: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
  speedMaintain: {
    score: number;
    feedback: string;
    graph: Array<{
      tag: string;
      ratio: number;
    }>;
  };
}

// 공회전 이벤트 타입
export interface IdlingEvent {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  duration: number;
  value: number;
}

// 속도 유지 데이터 항목 타입
export interface SpeedMaintainItem {
  value: number;
  label: string;
  color: string;
}

// 탄소 배출 처리된 데이터 타입
export interface ProcessedCarbonReport {
  score: number;
  idlingScore: number;
  speedMaintainScore: number;
  idlingFeedback: string;
  speedMaintainFeedback: string;
  idlingEvents: IdlingEvent[];
  speedMaintainData: SpeedMaintainItem[];
  totalIdlingMinutes: number;
}

// 안전 운전 보고서 관련 타입들
export interface SafetyReportData {
  score: number;
  acceleration: {
    score: number;
    ratio: number;
    feedback: string;
    title: string;
    chartData: AccelerationChartItem[];
  };
  turning: {
    score: number;
    ratio: number;
    safeRatio: number;
    dangerousRatio: number;
    feedback: string;
    title: string;
    chartData: TurningChartItem[];
  };
  speeding: {
    score: number;
    violations: number;
    feedback: string;
    title: string;
    speedLimit: number;
    chartData: SpeedingChartItem[];
  };
}

export interface AccelerationChartItem {
  value: number;
  label: string;
  flag: boolean;
  time: string;
}

export interface TurningChartItem {
  value: number;
  color: string;
  text: string;
  label: string;
  flag: boolean;
  time: string;
}

export interface SpeedingChartItem {
  speed: number;
  time: string;
  period: number;
}

export interface SafetyReportScreenProps {
  safetyData: SafetyReportData;
  selectedTab: string;
  options: string[];
  loading: boolean;
  formattedBarData: any[];
  pieData: any[];
  formattedLineData: any[];
  onTabSelect: (tab: string) => void;
  onBackPress: () => void;
}
export type AnalysisDataItem = {
  label: string;
  value: number;
  color: string;
};

export type DrivingAnalysis = {
  title: string;
  summary: string;
  data: AnalysisDataItem[];
};

export type DrivingTip = {
  text: string;
};

export type DrivingRecommendations = {
  summary: string;
  tips: DrivingTip[];
};

// 기존 타입 확장

// 공회전 이벤트 원본 타입
export interface IdlingEventRaw {
  startTime: string;
  endTime: string;
}

// 속도 유지 데이터 원본 타입
export interface SpeedMaintainItemRaw {
  tag: string;
  ratio: number;
}

// API 응답 타입
export interface EcoReportResponse {
  score: number;
  idling: {
    score: number;
    feedback: string;
    graph: IdlingEventRaw[];
  };
  speedMaintain: {
    score: number;
    feedback: string;
    graph: SpeedMaintainItemRaw[];
  };
}

