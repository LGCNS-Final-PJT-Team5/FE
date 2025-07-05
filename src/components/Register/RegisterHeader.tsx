import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type HeaderProps = {
  title: string;
  content: string;
  top?: boolean;
};

export const RegisterHeader = ({title, content, top}: HeaderProps) => {
  return (
    <View style={[top && styles.topMargin]}>
      <Text style={[styles.title]}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#565656',
  },
  topMargin: {
    marginTop: -75,
  },
  content: {
    fontSize: 14,
    color: '#565656',
    opacity: 0.7,
    marginTop: 2,
  },
});
