import { Image } from "react-native";

export const getMobtiType = (score: number): string => {
  // 예시: 단순 점수 기준
  if (score > 80) return 'AIFE';
  if (score > 60) return 'AIUE';
  if (score > 40) return 'ASFE';
  if (score > 20) return 'DIFE';
  if (score > 0) return 'DSFE';
  // 기본값
  return 'DEFAULT';
};

type MobtiMeta = {
  image: any;
  label: string;
};

const mobtiMap: Record<string, MobtiMeta> = {
  AIFE: {
    image: require('../assets/mobti/AIFE.png'),
    label: '신중하고 체계적인 드라이버',
  },
  AIFH: {
    image: require('../assets/mobti/AIFH.png'),
    label: '계획적인 완벽주의 드라이버',
  },
  AIUE: {
    image: require('../assets/mobti/AIUE.png'),
    label: '자유롭고 유연한 드라이버',
  },
  AIUH: {
    image: require('../assets/mobti/AIUH.png'),
    label: '직관적인 독립형 드라이버',
  },
  ASFE: {
    image: require('../assets/mobti/ASFE.png'),
    label: '균형 잡힌 실용적 드라이버',
  },
  ASFH: {
    image: require('../assets/mobti/ASFH.png'),
    label: '논리적인 정석 드라이버',
  },
  ASUF: {
    image: require('../assets/mobti/ASUF.png'),
    label: '융통성 있는 다재다능 드라이버',
  },
  ASUH: {
    image: require('../assets/mobti/ASUH.png'),
    label: '감각적인 도전형 드라이버',
  },
  DIFE: {
    image: require('../assets/mobti/DIFE.png'),
    label: '섬세하고 조심스러운 드라이버',
  },
  DIFH: {
    image: require('../assets/mobti/DIFH.png'),
    label: '규칙을 중시하는 안정형 드라이버',
  },
  DIUE: {
    image: require('../assets/mobti/DIUE.png'),
    label: '호기심 많은 탐색형 드라이버',
  },
  DIUH: {
    image: require('../assets/mobti/DIUH.png'),
    label: '즉흥적이고 자신감 있는 드라이버',
  },
  DSFE: {
    image: require('../assets/mobti/DSFE.png'),
    label: '데이터 기반의 분석형 드라이버',
  },
  DSFH: {
    image: require('../assets/mobti/DSFH.png'),
    label: '보수적이고 안전한 드라이버',
  },
  DSUE: {
    image: require('../assets/mobti/DSUE.png'),
    label: '빠르게 적응하는 실전형 드라이버',
  },
  DSUH: {
    image: require('../assets/mobti/DSUH.png'),
    label: '과감하고 모험적인 드라이버',
  },
  DEFAULT: {
    image: require('../assets/mobti/default.png'),
    label: '첫 주행을 기다리고 있어요',
  },
};

export const getMobtiMeta = (type: string): MobtiMeta => {
  return mobtiMap[type] || mobtiMap.DEFAULT;
};