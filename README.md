# Modive - 운전 습관 분석 서비스

<p align="center">
  <img src="./src/assets/modive_logo.svg" alt="Modive Logo" width="300" />
</p>

## 📱 프로젝트 개요

Modive는 시뮬레이터를 통해 수집된 데이터를 기반으로 사용자의 운전습관을 분석하고 개선점을 제안하는 모바일 서비스입니다. 사용자는 직관적인 차트와 데이터 시각화를 통해 자신의 운전 스타일을 이해하고, 안전하고 친환경적인 운전을 위한 피드백을 받을 수 있습니다.

## ✨ 주요 기능

- **종합 운전 습관 분석**: 안전 운전, 사고 예방, 탄소 배출, 주의력 등 다각적 분석
- **차트 시각화**: 다양한 차트 유형을 통한 직관적인 데이터 시각화
- **Mobti (운전 성향 MBTI)**: 운전 데이터를 기반으로 사용자의 운전 성향을 16가지 유형으로 분류
- **씨앗 보상 시스템**: 안전 운전과 친환경 주행 시 보상을 통한 사용자 참여 유도
- **실시간 운전 알림**: 위험 운전 패턴 감지 시 실시간 알림
- **주행 기록**: 과거 주행 기록 열람 및 상세 분석

## 🛠 기술 스택

### 프론트엔드
- **언어**: TypeScript
- **프레임워크**: React Native 0.79.1
- **상태 관리**: Zustand
- **차트 라이브러리**: react-native-gifted-charts, react-native-svg
- **인증**: 카카오 소셜 로그인 (@react-native-seoul/kakao-login)
- **API 통신**: Axios
- **알림**: Firebase Cloud Messaging (FCM), Notifee
- **테스트**: Jest, React Testing Library

### 아키텍처
- Container/Presenter 패턴 적용으로 비즈니스 로직과 UI 분리
- 모듈형 컴포넌트 설계로 재사용성 극대화

## ⚙️ 설치 및 설정

### 사전 요구사항
- Node.js 18.x 이상
- JDK 17
- Android Studio / Xcode
- CocoaPods (iOS)

### 설치 과정

```bash
# 저장소 클론
git clone https://github.com/username/modive.git
cd modive

# 패키지 설치
yarn install

# iOS 의존성 설치 (iOS 개발 시)
cd ios
bundle install
bundle exec pod install
cd ..

# 앱 실행 (Android)
yarn android

# 앱 실행 (iOS)
yarn ios
```

## 📊 주요 컴포넌트

### 차트 컴포넌트
- **CircleChart**: 원형 진행률 표시
- **GaugeChart**: 반원형 계기판 형태의 점수 시각화
- **AccelerationChart**: 급가속/급감속 이벤트 분석
- **TurningChart**: 회전 패턴 분석
- **SafeDistanceChart**: 차간 안전거리 유지 시각화
- **SpeedDistributionPieChart**: 속도 분포도 시각화

### 화면 컴포넌트
- **DrivingHistoryScreen**: 과거 주행 기록 목록
- **DrivingDetailScreen**: 주행 상세 분석
- **SafetyReportScreen**: 안전 운전 점수 분석
- **CarbonEmissionReportScreen**: 탄소 배출 및 연비 분석
- **AccidentPreventionReportScreen**: 사고 예방 점수 분석
- **AttentionScoreReportScreen**: 주의력 점수 분석

## 🚀 주요 구현 성과

1. **데이터 시각화**: 복잡한 주행 데이터를 다양한 차트로 시각화하여 직관적인 피드백 제공
2. **Mobti 시스템**: 독자적인 운전 성향 MBTI 'Mobti'를 개발하여 사용자 참여도 향상
3. **안정적인 네트워크 통신**: Axios 인터셉터를 활용한 토큰 갱신 및 오류 처리 로직 구현
4. **실시간 알림 시스템**: FCM과 Notifee를 연동하여 앱 사용 여부와 무관하게 중요 알림 제공
5. **테스트 자동화**: Jest와 React Testing Library를 활용한 컴포넌트 테스트 구현
6. **코드 품질 관리**: ESLint와 Prettier를 활용한 일관된 코드 스타일 유지

## 🔍 API 통신 구조

```typescript
// API 통신 예시 - 안전 운전 점수 가져오기
export const fetchSafetyReport = async (driveId: string) => {
  try {
    const response = await apiClient.get(`/api/drive/${driveId}/safety`);
    return response.data;
  } catch (error) {
    console.error('안전 운전 점수 조회 실패:', error);
    throw error;
  }
};
```

## 📱 알림 시스템

Firebase Cloud Messaging과 Notifee를 활용하여 다양한 운전 이벤트(급가속, 급감속, 차선이탈 등)에 대한 실시간 알림을 제공합니다. 백그라운드와 포그라운드 상태에 따른 알림 처리 로직이 구현되어 있습니다.

```typescript
// 알림 채널 생성
const createNotificationChannels = async () => {
  const channels = [
    {id: 'crash', name: '충돌 알림', sound: 'crash'},
    {id: 'safedistance', name: '안전거리 알림', sound: 'safedistance'},
    // ...더 많은 알림 채널
  ];

  for (const channel of channels) {
    await notifee.createChannel({
      id: channel.id,
      name: channel.name,
      sound: channel.id,
      importance: AndroidImportance.HIGH,
    });
  }
};
```

## ✅ 테스트

Jest와 React Testing Library를 활용하여 주요 컴포넌트에 대한 단위 테스트를 구현했습니다.

```bash
# 테스트 실행
yarn test

# 커버리지 리포트 생성
yarn test --coverage
```

## 📋 프로젝트 구조

```
modive/
├── src/
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   │   ├── common/     # 공통 컴포넌트
│   │   └── Driving/    # 운전 관련 컴포넌트
│   ├── containers/     # 비즈니스 로직 컨테이너
│   ├── screens/        # 화면 컴포넌트
│   ├── services/       # API 서비스
│   ├── store/          # Zustand 상태 관리
│   ├── theme/          # 테마 및 스타일 
│   ├── types/          # TypeScript 타입 정의
│   └── utils/          # 유틸리티 함수
├── __tests__/          # 테스트 코드
├── android/            # Android 네이티브 코드
└── ios/                # iOS 네이티브 코드
```


---

© 2025 Modive Team. All Rights Reserved.
