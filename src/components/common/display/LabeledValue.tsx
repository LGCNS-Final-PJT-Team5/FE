import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

type Props = {
  title: string;
  content: string;
};

export const LabeledValue = ({title, content}: Props) => {
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.block}>
        <Text style={styles.blockText}>{content}</Text>
      </View>
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
    fontSize: 16,
    color: '#000',
  },
  block: {
    width: '80%',
    height: 40,
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderColor: '#D9D9D9',
    borderWidth: 0.5,
    borderRadius: 6,
  },
  blockText: {
    fontSize: 16,
    color: '#909090',
  },
});
