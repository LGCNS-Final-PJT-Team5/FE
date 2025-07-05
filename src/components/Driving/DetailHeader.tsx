import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface DetailHeaderProps {
  title: string;
  onClose: () => void;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({ title, onClose }) => {
  return (
    <View style={styles.header}>
      <View style={styles.spacer24} />
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        accessibilityLabel="뒤로가기 버튼"
        activeOpacity={0.7}
      >
        <Icon name="x" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4945FF',
  },
  closeButton: {
    padding: 8,
  },
  spacer24: {
    width: 24,
  },
});

export default DetailHeader;