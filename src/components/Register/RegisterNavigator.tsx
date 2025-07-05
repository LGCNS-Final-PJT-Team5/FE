import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

type NavigatorProps = {
  pageIndex: number;
  goToPrior: () => void;
  close: () => void;
};

export const RegisterNavigator = ({
  pageIndex,
  goToPrior,
  close,
}: NavigatorProps) => {
  return (
    <View style={styles.appbarContainer}>
      {pageIndex > 0 ? (
        <TouchableOpacity
          onPress={() => {
            goToPrior();
          }}>
          <Feather name="chevron-left" size={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.blackBox} /> // ← 자리를 맞추기 위한 빈 박스
      )}
      <TouchableOpacity style={styles.appbarButton} onPress={close}>
        <Feather name="x" size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appbarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 30,
    marginTop: 80,
    height: 50,
  },
  appbarButton: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  blackBox: {
    width: 24,
  },
});
