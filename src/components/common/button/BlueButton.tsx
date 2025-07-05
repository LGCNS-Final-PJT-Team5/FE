import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

type ButtonProps = {
  title: string;
  moveNext: () => void;
};

export const BlueButton = ({title, moveNext}:ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={moveNext}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: 40,
    backgroundColor: '#3B5BFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
