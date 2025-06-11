import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/services/navigation/AppNavigator';
import {PermissionsAndroid, Platform, AppState} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from './src/store/useAuthStore';
import {useUserStore} from './src/store/useUserStore';

// 알림 채널 생성 함수를 별도로 분리
const createNotificationChannels = async () => {
  // 모든 채널을 한 번에 정의하고 생성
  const channels = [
    {id: 'crash', name: '충돌 알림', sound: 'crash'},
    {id: 'idle', name: '공회전 알림', sound: 'idle'},
    {id: 'lineout', name: '차선 이탈 알림', sound: 'lineout'},
    {id: 'overspeed', name: '과속 알림', sound: 'overspeed'},
    {id: 'nooperator', name: '미조작 알림', sound: 'nooperator'},
    {id: 'sharpturn', name: '급회전 알림', sound: 'sharpturn'},
    {id: 'safedistance', name: '안전거리 알림', sound: 'safedistance'},
    {id: 'rapidacceleration', name: '급가속 알림', sound: 'rapidacceleration'},
    {id: 'rapiddeceleration', name: '급감속 알림', sound: 'rapiddeceleration'},
    {id: 'default', name: '기본 알림', sound: 'default'},
  ];

  for (const channel of channels) {
    await notifee.createChannel({
      id: channel.id,
      name: channel.name,
      sound: channel.id,
      importance: AndroidImportance.HIGH,
    });
  }
  
  console.log('모든 알림 채널이 생성되었습니다.');
};

// 알림 표시 함수
const showLocalNotification = async (remoteMessage, userAlarmSetting, isLoggedIn) => {
  // 로그인 상태 확인
  if (!isLoggedIn) {
    console.log('로그인되지 않은 사용자이므로 알림을 표시하지 않습니다.');
    return;
  }
  
  if (!userAlarmSetting) {
    console.log('알림을 비활성화한 사용자이므로 알림을 표시하지 않습니다.');
    return;
  }
  // 알림 설정 확인
  console.log('포그라운드 알림 설정:', userAlarmSetting);

  const channel =
    remoteMessage.data?.channel ||
    remoteMessage.notification?.android?.channelId ||
    'default';

  const allowedChannels = [
    'crash', 'idle', 'lineout', 'overspeed', 
    'nooperator', 'rapiddeceleration',
    'rapidacceleration', 'safedistance', 'sharpturn'
  ];
  const useChannel = allowedChannels.includes(channel) ? channel : 'default';

  const notificationId = `fg_${useChannel}_${Date.now()}`;

  await notifee.displayNotification({
    id: notificationId,
    title: remoteMessage.data?.title || remoteMessage.notification?.title,
    body: remoteMessage.data?.body || remoteMessage.notification?.body,
    android: {
      channelId: useChannel,
      sound: useChannel,
      importance: AndroidImportance.HIGH,
    },
  });
  
  console.log(`포그라운드 알림 표시됨: ${useChannel}`);
};

function App(): React.JSX.Element {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
  const setFcmToken = useAuthStore(state => state.setFcmToken);
  
  // 사용자 스토어에서 직접 가져오기
  const hasHydrated = useUserStore(state => state.hasHydrated);
  const user = useUserStore(state => state.user);
  const userAlarmSetting = user?.alarm;

  // 앱 초기화 로직
  useEffect(() => {
    // Zustand가 hydrate 될 때까지 대기
    if (!hasHydrated) {
      console.log('Zustand 데이터 로딩 중...');
      return;
    }

    const initializeApp = async () => {
      // 알림 채널 초기화
      await createNotificationChannels();
      
      // 로그인 상태 확인
      const checkToken = async () => {
        try {
          const jwtToken = await AsyncStorage.getItem('jwtToken');
          if (jwtToken && !isLoggedIn) {
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.warn('토큰 체크 중 오류 발생:', error);
        }
      };

      // 알림 권한 요청
      const requestNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          console.log('알림 권한 상태:', granted);
        }
      };

      // FCM 토큰 요청
      const requestFcmToken = async () => {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          console.log('FCM 권한 상태:', enabled);
          if (enabled) {
            const token = await messaging().getToken();
            console.log('FCM 토큰:', token);
            setFcmToken(token);
          }
        } catch (error) {
          console.error('FCM 토큰 얻기 실패:', error);
        }
      };

      // 모든 초기화 함수 실행
      await checkToken();
      await requestNotificationPermission();
      await requestFcmToken();
    };

    initializeApp();

    // 포그라운드 메시지 핸들러 (앱이 열려 있을 때)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      
      // 앱이 포그라운드 상태일 때만 커스텀 알림 표시
      if (AppState.currentState === 'active') {
        await showLocalNotification(remoteMessage, userAlarmSetting, isLoggedIn);
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [hasHydrated, isLoggedIn, userAlarmSetting]); // userAlarmSetting 의존성 추가

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;