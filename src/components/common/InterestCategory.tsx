import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

type CategoryProps = {
  value: string;
  setValue: (arg0: string) => void;
  categories: string[];
};

export const InterestCategory = ({value, setValue, categories} : CategoryProps ) => {

  const renderItem = ({ item }: { item: string }) => {
    const isSelected = value === item;

    return (
      <TouchableOpacity
        onPress={() => setValue(item)}
        style={[styles.button, isSelected && styles.selectedButton]}
      >
        <Text style={[styles.text, isSelected && styles.selectedText]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.columnWrapperStyle}
      />

  );
};

const styles = StyleSheet.create({

  grid: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  button: {
    width: 130,
    aspectRatio: 1.6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 5,
  },
  selectedButton: {
    borderColor: '#3B82F6',
    backgroundColor: '#F1F6FF',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  selectedText: {
    fontWeight: '500',
  },
});
