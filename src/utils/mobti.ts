import { DriveScores } from '../types/dashboard';

type MobtiMeta = {
  image: any;
  label: string;
};

const mobtiMap: Record<string, MobtiMeta> = {
  DSFE: {
    image: require('../assets/mobti/DSFE.png'),
    label: '안전 지킴이',
  },
  DSFH: {
    image: require('../assets/mobti/DSFH.png'),
    label: '신중한 운전자',
  },
  DSUE: {
    image: require('../assets/mobti/DSUE.png'),
    label: '마일드 드라이버',
  },
  DSUH: {
    image: require('../assets/mobti/DSUH.png'),
    label: '편안한 순항자',
  },
  DIFE: {
    image: require('../assets/mobti/DIFE.png'),
    label: '절제된 운전자',
  },
  DIFH: {
    image: require('../assets/mobti/DIFH.png'),
    label: '일관된 운전자',
  },
  DIUE: {
    image: require('../assets/mobti/DIUE.png'),
    label: '느긋한 운전자',
  },
  DIUH: {
    image: require('../assets/mobti/DIUH.png'),
    label: '묵묵한 드라이버',
  },
  ASFE: {
    image: require('../assets/mobti/ASFE.png'),
    label: '스마트 드라이버',
  },
  ASFH: {
    image: require('../assets/mobti/ASFH.png'),
    label: '스포티한 드라이버',
  },
  ASUE: {
    image: require('../assets/mobti/ASUE.png'),
    label: '직관적 드라이버',
  },
  ASUH: {
    image: require('../assets/mobti/ASUH.png'),
    label: '즉흥적 드라이버',
  },
  AIFE: {
    image: require('../assets/mobti/AIFE.png'),
    label: '효율적 질주자',
  },
  AIFH: {
    image: require('../assets/mobti/AIFH.png'),
    label: '열정적 드라이버',
  },
  AIUE: {
    image: require('../assets/mobti/AIUE.png'),
    label: '자유로운 드라이버',
  },
  AIUH: {
    image: require('../assets/mobti/AIUH.png'),
    label: '돌진형 드라이버',
  },
  DEFAULT: {
    image: require('../assets/mobti/default.png'),
    label: '첫 주행을 기다리고 있어요',
  },
};

export const getMobtiType = (scores: DriveScores): string => {
  // 모든 점수가 0인 경우 (운전 데이터가 없는 경우) 기본값 반환
  const allScores = Object.values(scores);
  const isAllZero = allScores.every(score => score === 0);
  
  if (isAllZero) {
    return 'DEFAULT';
  }

  const styleScore = (100 - scores.accelerationScore + 100 - scores.sharpTurnScore + 100 - scores.overSpeedScore) / 3;
  const sensitivityScore = (scores.reactionScore + scores.accelerationScore) / 2;
  const focusScore = (scores.attentionScore + scores.laneDepartureScore + scores.followingDistanceScore) / 3;
  const energyScore = (scores.ecoScore + scores.speedMaintainScore + scores.idlingScore) / 3;

  const driving = styleScore >= 50 ? 'D' : 'A';
  const response = sensitivityScore >= 50 ? 'S' : 'I';
  const focus = focusScore >= 50 ? 'F' : 'U';
  const energy = energyScore >= 50 ? 'E' : 'H';

  return `${driving}${response}${focus}${energy}`;
};

export const getMobtiMeta = (type: string): MobtiMeta => {
  return mobtiMap[type] || mobtiMap.DEFAULT;
};
