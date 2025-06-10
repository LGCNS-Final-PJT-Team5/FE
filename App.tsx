import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/services/navigation/AppNavigator';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from './src/store/useAuthStore';

// 알림 채널 생성 함수를 별도로 분리
const createNotificationChannels = async () => {
  // 모든 채널을 한 번에 정의하고 생성
  const channels = [
    {id: 'crash', name: '충돌 알림', sound: 'crash'},
    {id: 'idle', name: '공회전 알림', sound: 'idle'},
    {id: 'lineout', name: '차선 이탈 알림', sound: 'lineout'},
    {id: 'overspeed', name: '과속 알림', sound: 'overspeed'},
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
const showLocalNotification = async (remoteMessage) => {
  const channel =
    remoteMessage.data?.channel ||
    remoteMessage.notification?.android?.channelId ||
    'default';

  const allowedChannels = ['crash', 'idle', 'lineout', 'overspeed'];
  const useChannel = allowedChannels.includes(channel) ? channel : 'default';

  const notificationId = `${useChannel}_${Date.now()}`;

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
};

function App(): React.JSX.Element {
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  // 앱 초기화 로직을 의존성 배열을 비워 한 번만 실행되도록 수정
  useEffect(() => {
    // 알림 채널 초기화
    createNotificationChannels();
    
    // 로그인 상태 확인
    const checkToken = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (jwtToken) {
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
          // TODO: 이 토큰을 서버에 전송하는 로직 추가
        }
      } catch (error) {
        console.error('FCM 토큰 얻기 실패:', error);
      }
    };

    // 모든 초기화 함수 실행
    checkToken();
    requestNotificationPermission();
    requestFcmToken();

    // 포그라운드 메시지 핸들러 (앱이 열려 있을 때)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      await showLocalNotification(remoteMessage);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []); // 빈 의존성 배열로 앱 시작시 한 번만 실행

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
