import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  content: string;
  setContent: (content: string) => void;
  placeholder: string;
};

export const LabeledInput = ({
  title,
  content,
  setContent,
  placeholder,
}: Props) => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#C7C7CD"
        style={styles.textInput}
        maxLength={10}
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: '#000',
  },
  textInput: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
});
