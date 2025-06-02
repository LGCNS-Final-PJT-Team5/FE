import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/services/navigation/AppNavigator';
import {PermissionsAndroid, Platform, StatusBar} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuthStore} from './src/store/useAuthStore';

function App(): React.JSX.Element {
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  async function showLocalNotification(remoteMessage) {
    const channel =
      remoteMessage.data?.channel ||
      remoteMessage.notification?.android?.channelId ||
      'default';

    const allowedChannels = ['crash', 'idle', 'lineout', 'overspeed'];
    const useChannel = allowedChannels.includes(channel) ? channel : 'default';

    // 유니크한 알림 ID 생성 (예: timestamp, nanoid 등)
    const notificationId = `${useChannel}_${Date.now()}`;
    console.log(notificationId);

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
  }

  async function createCrashChannel() {
    await notifee.createChannel({
      id: 'crash',
      name: 'crash',
      sound: 'crash',
      importance: AndroidImportance.HIGH,
    });
  }

  async function createIdleChannel() {
    await notifee.createChannel({
      id: 'idle',
      name: 'idle',
      sound: 'idle', // 여기도 확장자 없이
      importance: AndroidImportance.HIGH,
    });
  }

  async function createLineoutChannel() {
    await notifee.createChannel({
      id: 'lineout',
      name: 'lineout',
      sound: 'lineout', // 여기도 확장자 없이
      importance: AndroidImportance.HIGH,
    });
  }

  async function createOverspeedChannel() {
    await notifee.createChannel({
      id: 'overspeed',
      name: 'overspeed',
      sound: 'overspeed', // 여기도 확장자 없이
      importance: AndroidImportance.HIGH,
    });
  }

  useEffect(() => {
    const requestAndroidNotificationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('알림 권한 상태:', granted);
      }
    };
    requestAndroidNotificationPermission();

    const requestPermissionAndGetToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('Permission status:', enabled);
      if (enabled) {
        const token = await messaging().getToken();
        console.log(token);
      }
    };

    requestPermissionAndGetToken();
    requestAndroidNotificationPermission();

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      await showLocalNotification(remoteMessage);
    });
    messaging().onMessage(async remoteMessage => {
      await showLocalNotification(remoteMessage);
    });

    createCrashChannel();
    createIdleChannel();
    createLineoutChannel();
    createOverspeedChannel();
  }, []);

  useEffect(() => {
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

    checkToken();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
