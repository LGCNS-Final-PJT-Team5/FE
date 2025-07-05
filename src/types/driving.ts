export interface DriveHistoryItem {
  driveId: string;
  date: string;
  startTime: string;
  endTime: string;
  summaryScore: number;
}

// 주행 상세 화면에 필요한 타입 정의
export interface DrivingScoreItem {
  name: string;
  value: number;
  color: string;
}

export interface DrivingDetailData {
  date: string;
  time: string;
  totalScore: number;
  scores: Array<{name: string; value: number; color: string}>;
  message: string;
}

// 네비게이션 타입
export type DrivingStackParamList = {
  DrivingHistory: undefined;
  Driving: undefined;
  DrivingDetail: { drivingId: string };
  SafetyReport: undefined;
  CarbonEmissionReport: undefined;
  AccidentPreventionReport: undefined;
  AttentionScoreReport: undefined;
};

// 이벤트 시간 타입
export interface TimeEvent {
  id: string;
  time: string;
  formattedTime: string;
}

// 이벤트 시간 범위 타입
export interface TimeRangeEvent extends TimeEvent {
  endTime: string;
  formattedEndTime: string;
  duration: number;
}

// 사고 예방 리포트 관련 타입
export interface AccidentPreventionData {
  score: number;
  reaction: {
    score: number;
    feedback: string;
    graph: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
  laneDeparture: {
    score: number;
    feedback: string;
    graph: string[];
  };
  followingDistance: {
    score: number;
    feedback: string;
    graph: Array<{
      startTime: string;
      endTime: string;
    }>;
  };
}