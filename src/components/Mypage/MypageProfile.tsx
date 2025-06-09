import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ProfileProps = {
  name: string;
  car: string;
};

export const MypageProfile = ({name, car}: ProfileProps) => {
  return (
    <LinearGradient
      colors={['#5B9BF8', '#7B6EEB']}
      // colors={['#3b82f6', '#635de6']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <View style={styles.profileContent}>
        <View style={styles.profileAvatarContainer}>
          <MaterialIcons name={'person'} size={32} color={'white'} />
        </View>
        <View style={styles.profileDetails}>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName}>{name || '사용자'}</Text>
            <Text style={styles.greetingText}>님, 반가워요!</Text>
          </View>
          {car && car !== '등록된 차량 없음' ? (
            <View style={styles.carContainer}>
              <Text style={styles.profileCar}>현재 차량: {car}</Text>
            </View>
          ) : (
            <Text style={styles.noCarText}>차량을 등록해주세요</Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  profileAvatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
    fontWeight: '400',
  },
  carContainer: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  profileCar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  noCarText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
