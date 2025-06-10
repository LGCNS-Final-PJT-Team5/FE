/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

// 백그라운드 메시지 핸들러는 여기에 등록해야 합니다
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  
  const channel = remoteMessage.data?.channel || 'default';
  const allowedChannels = ['crash', 'idle', 'lineout', 'overspeed'];
  const useChannel = allowedChannels.includes(channel) ? channel : 'default';
  
  await notifee.displayNotification({
    id: `${useChannel}_${Date.now()}`,
    title: remoteMessage.data?.title || remoteMessage.notification?.title,
    body: remoteMessage.data?.body || remoteMessage.notification?.body,
    android: {
      channelId: useChannel,
      sound: useChannel,
      importance: AndroidImportance.HIGH,
    },
  });
});

AppRegistry.registerComponent(appName, () => App);
