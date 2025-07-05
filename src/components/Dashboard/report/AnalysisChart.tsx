import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AnalysisDataItem} from '../../../types/report';
// import { BarChart } from 'react-native-gifted-charts'; // 필요한 경우 사용할 수 있음

export default function AnalysisChart({
  chartData,
}: {
  chartData: AnalysisDataItem[];
}) {
  return (
    <>
      {chartData.map((item, index) => (
        <View key={index}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}>
            <Text style={{fontSize: 13, color: '#555'}}>{item.label}</Text>
            <Text style={{fontSize: 13, color: '#555'}}>{item.value}%</Text>
          </View>
          <View style={styles.scoreBar}>
            <View
              style={[
                styles.scoreProgress,
                {
                  backgroundColor: item.color,
                  width: `${item.value}%`,
                  borderRadius: 15,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  scoreBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'visible',
    marginTop: 8,
    position: 'relative',
    backgroundColor: '#c4c4c4',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 5,
  },
});
