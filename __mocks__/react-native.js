const reactNative = jest.requireActual('react-native');

module.exports = {
  ...reactNative,
  // 필요한 컴포넌트 모킹
  FlatList: jest.fn().mockImplementation(props => {
    return null;
  }),
  TouchableOpacity: jest.fn().mockImplementation(props => {
    return null;
  }),
  // 추가 컴포넌트 필요에 따라 모킹
};