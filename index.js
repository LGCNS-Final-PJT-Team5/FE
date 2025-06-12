/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

// 알림 채널 생성 함수 추가
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
    {id: 'reactiondelay', name: '반응속도 알림', sound: 'reactiondelay'},
    {id: 'default', name: '기본 알림', sound: 'default'},
  ];

  for (const channel of channels) {
    await notifee.createChannel({
      id: channel.id,
      name: channel.name,
      sound: channel.id, // 채널 ID와 동일한 소리 파일명 사용
      importance: AndroidImportance.HIGH,
    });
  }
  
  console.log('백그라운드용 알림 채널이 생성되었습니다.');
};

// 앱 시작 시 채널 초기화 (백그라운드 작업 전에 실행됨)
createNotificationChannels()
  .catch(error => console.error('알림 채널 생성 실패:', error));

// 백그라운드 메시지 핸들러는 여기에 등록해야 합니다
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message received:', remoteMessage);
  
  const channel = remoteMessage.data?.channel || 'default';
  const allowedChannels = [
    'crash', 'idle', 'lineout', 'overspeed', 
    'nooperator', 'rapiddeceleration',
    'rapidacceleration', 'safedistance', 'sharpturn', 'reactiondelay'
  ];
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
