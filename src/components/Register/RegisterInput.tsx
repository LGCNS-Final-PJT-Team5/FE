import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

type InputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
  isCount: boolean;
  maxLength?: number;
};

export const RegisterInput = ({ text, setText, placeholder, isCount, maxLength }: InputProps) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#C7C7CD"
        style={styles.textInput}
        maxLength={maxLength}
        value={text}
        onChangeText={setText}
      />
      {(isCount) ?
        <Text style={styles.charCount}>{text.length}/{maxLength}</Text>
      : <Text style={styles.charCount}/>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    marginTop: 20,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 24,
    color: '#000',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: '#C7C7CD',
    marginTop: 10,
  },
});
