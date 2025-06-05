import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type ProfileProps = {
  name: string;
  car: string;
};

export const MypageProfile = ({name, car}: ProfileProps) => {
  return (
    <View style={styles.profile}>
      <EvilIcons
        name={'user'}
        size={70}
        color={'#c4c4c4'}
        style={styles.profileImage}
      />
      <View style={{gap: 3}}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileCar}>{car}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#F1F5FD',
  },

  profileImage: {
    padding: 5,
  },

  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F5AF0',
  },

  profileCar: {
    fontSize: 12,
    color: '#B3B3B3',
  },
});
