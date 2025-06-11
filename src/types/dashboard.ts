export type HomeStackParamList = {
  Dashboard: undefined;
  Feedback: undefined;
};

export type DashboardResponse = {
  userId: string;
  lastDrive: string;
  driveCount: number;
  scores: DriveScores;
};

export type DriveScores = {
  idlingScore: number;
  speedMaintainScore: number;
  ecoScore: number;
  accelerationScore: number;
  sharpTurnScore: number;
  overSpeedScore: number;
  safetyScore: number;
  reactionScore: number;
  laneDepartureScore: number;
  followingDistanceScore: number;
  accidentPreventionScore: number;
  drivingTimeScore: number;
  inactivityScore: number;
  attentionScore: number;
  totalScore: number;
};

export type Feedback = {
  title: string;
  content: string;
};

export type DetailedFeedback = {
  title: string;
  content: string;
  feedback: string[];
};

export type DrivingReportResponse = {
  userId: string;
  userType: "ECO" | "INSURANCE" | "BEGINNER" | "REWARD" | "MAINTENANCE" | "CARBON" | "DRIVESTAR" | "TECHNIQUE";
  driveCount: number;
  scores: DriveScores;
  totalFeedback: Feedback;
  detailedFeedback: DetailedFeedback;
};