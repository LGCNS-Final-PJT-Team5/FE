import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
  options: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  primaryColor?: string;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  options,
  selectedTab,
  onTabChange,
  primaryColor = '#BB27FF',
}) => {
  return (
    <View style={styles.tabContainer}>
      {options.map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={
            selectedTab === tab
              ? [styles.tabItem, { ...styles.tabItemActive, borderBottomColor: primaryColor }]
              : styles.tabItem
          }
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedTab === tab }}
          accessibilityLabel={tab}
          activeOpacity={0.7}
        >
          <Text
            style={
              selectedTab === tab 
                ? { ...styles.tabTextActive, color: primaryColor } 
                : styles.tabText
            }>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 0,
    marginTop: 8,
  },
  tabItem: {
    paddingVertical: 16,
    minHeight: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TabSelector;