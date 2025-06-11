import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import AnalysisBox from '../../components/Dashboard/report/AnalysisBox';
import {DrivingAnalysis, DrivingRecommendations} from '../../types/report';
import TipBox from '../../components/Dashboard/report/TipBox';

type ReportScreenProps = {
  analysis: DrivingAnalysis;
  recommendations: DrivingRecommendations;
};
export default function ReportScreen({
  analysis,
  recommendations,
}: ReportScreenProps) {
  return (
    <ScrollView
      style={{backgroundColor: '#fff'}}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.reportBox}>
        <Text style={styles.titleText}>{recommendations.title}</Text>
        <AnalysisBox analysis={analysis} />
        <TipBox recommendations={recommendations} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  reportBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    gap: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
