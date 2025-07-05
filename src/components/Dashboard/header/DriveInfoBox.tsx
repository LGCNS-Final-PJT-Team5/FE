import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type DriveInfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function DriveInfoGroup({items}: {items: DriveInfoItemProps[]}) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View style={styles.row} key={index}>
          <View style={styles.labelRow}>
            {item.icon}
            <Text>{item.label}</Text>
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F5FD',
    borderRadius: 15,
    marginTop: 10,
    padding: 15,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  value: {
    color: '#4945FF',
    fontWeight: '500',
  },
});
