export const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MAX: 5,
  MIN: 1,
  NONE: 0,
};

export const EventType = {
  DELIVERED: 3,
  DISMISSED: 2,
  PRESS: 1,
  TRIGGER: 0,
};

export const AndroidVisibility = {
  PRIVATE: 0,
  PUBLIC: 1,
  SECRET: -1,
};

const notifee = {
  createChannel: jest.fn().mockResolvedValue('channel-id'),
  displayNotification: jest.fn().mockResolvedValue(),
  onForegroundEvent: jest.fn(() => () => {}),
  onBackgroundEvent: jest.fn(() => () => {}),
  getInitialNotification: jest.fn().mockResolvedValue(null),
  cancelAllNotifications: jest.fn().mockResolvedValue(),
  cancelNotification: jest.fn().mockResolvedValue(),
  getDisplayedNotifications: jest.fn().mockResolvedValue([]),
  getTriggerNotifications: jest.fn().mockResolvedValue([]),
  requestPermission: jest.fn().mockResolvedValue({ alert: true, badge: true, sound: true }),
};

export default notifee;