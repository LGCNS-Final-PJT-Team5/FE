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
          <Text style={styles.profileName}>{name || '사용자'}</Text>
          <Text style={styles.profileCar}>{car || '등록된 차량 없음'}</Text>
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
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileCar: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});
