// 앱 전체에서 사용할 색상 정의
export const colors = {
  primary: '#4945FF',
  neutralLight: '#F1F5FD',
  neutralDark: '#666666',
  timelineLine: '#D0D0D0',
  background: '#FFFFFF',
};

// 사고 예방 리포트 전용 컬러 시스템
export const ACCIDENT_COLORS = {
  primary: '#BB27FF', // 메인 컬러 - 보라색
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#BB27FF', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#BB27FF', // 메인 컬러와 동일
    blue: '#4299E1',
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
  },
  gradient: {
    purpleStart: 'rgba(187, 39, 255, 0.6)', // 메인 컬러 기반 그라데이션
    purpleEnd: 'rgba(187, 39, 255, 0.1)', // 메인 컬러 기반 그라데이션
    redStart: 'rgba(229, 62, 62, 0.6)',
    redEnd: 'rgba(229, 62, 62, 0.1)',
  },
  bg: {
    light: '#F9F5FF', // 연한 보라색 배경
    main: '#EBE3FF', // 주 보라색 배경
  },
};

// 안전 리포트 전용 컬러 시스템
export const SAFETY_COLORS = {
  primary: '#4ECD7B', // 메인 컬러 - 탭 활성화 색상과 동일하게 유지
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#68D392', // 메인 컬러와 동일
  chart: {
    green: '#68D392', // 메인 컬러와 동일하게 변경
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#805AD5',
    blue: '#4299E1',
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
  },
  bg: {
    light: '#F0FDF4', // 연한 녹색 배경
    main: '#DCFCE7', // 주 녹색 배경
  },
};

// 친환경 리포트 전용 컬러 시스템
export const CARBON_COLORS = {
  primary: '#007AFF',  // 메인 컬러 - 파란색
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#007AFF', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#805AD5',
    blue: '#007AFF', // 메인 컬러와 동일
    yellow: '#ECC94B',
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
    highSpeed: '#E53E3E',  // 고속 주행 - 빨간색
    midSpeed: '#68D392',   // 중속 주행 - 파란색
    lowSpeed: '#F8E6B6',   // 저속 주행 - 초록색
  },
  gradient: {
    blueStart: 'rgba(0, 122, 255, 0.6)', // 메인 컬러 기반 그라데이션
    blueEnd: 'rgba(0, 122, 255, 0.1)', // 메인 컬러 기반 그라데이션
  },
  bg: {
    light: '#EBF8FF', // 연한 파란색 배경
    main: '#BEE3F8', // 주 파란색 배경
  },
};

// 주의력 리포트 전용 컬러 시스템
export const ATTENTION_COLORS = {
  primary: '#FFD927', // 메인 컬러 - 노란색
  danger: '#FF5252',
  background: '#FFFFFF',
  cardBackground: '#FCFCFC',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    light: '#718096',
  },
  border: '#E5E5E5',
  shadow: '#000000',
  success: '#FFD927', // 메인 컬러와 동일
  chart: {
    green: '#68D392',
    red: '#E53E3E',
    orange: '#ED8936',
    purple: '#BB27FF',
    blue: '#4299E1',
    yellow: '#FFD927', // 메인 컬러와 동일
    background: '#F9FAFC',
    grid: '#CBD5E0',
    lightGrid: 'rgba(203, 213, 224, 0.3)',
    inactivity: '#E53E3E', // 미조작 시간 표시 색상
  },
  gradient: {
    yellowStart: 'rgba(255, 217, 39, 0.6)', // 메인 컬러 기반 그라데이션
    yellowEnd: 'rgba(255, 217, 39, 0.1)', // 메인 컬러 기반 그라데이션
    orangeStart: 'rgba(237, 137, 54, 0.6)',
    orangeEnd: 'rgba(237, 137, 54, 0.1)',
  },
  bg: {
    light: '#FFFFF0', // 연한 노란색 배경
    main: '#FEFCBF', // 주 노란색 배경
  },
};