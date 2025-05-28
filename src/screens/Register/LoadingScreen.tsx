import React from 'react';
import {View, StyleSheet} from 'react-native';
import Logo from '../../assets/modive_logo.svg';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Logo width={280} height={80} />;
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
