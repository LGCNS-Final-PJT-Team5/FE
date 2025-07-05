import StepIndicator from 'react-native-step-indicator';
import {StyleSheet, View} from 'react-native';
import React from 'react';

type IndicatorProps = {
  pageIndex: number;
};
export const RegisterIndicator = ({pageIndex}:IndicatorProps) => {

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={stepperStyles}
        currentPosition={pageIndex}
        labels={[]}
        stepCount={4}
      />
    </View>
  );
};

const stepperStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#3B5BFF',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#3B5BFF',
  stepStrokeUnFinishedColor: '#F1F5FD',
  separatorFinishedColor: '#3B5BFF',
  separatorUnFinishedColor: '#F1F5FD',
  stepIndicatorFinishedColor: '#3B5BFF',
  stepIndicatorUnFinishedColor: '#F1F5FD',
  stepIndicatorCurrentColor: '#3B5BFF',
  stepIndicatorLabelFontSize: 20,
  currentStepIndicatorLabelFontSize: 20,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#000000',
  labelColor: '#999999',
  labelSize: 12,

  currentStepLabelColor: '#3B5BFF',
};

const styles = StyleSheet.create({
  container: {
    margin: 'auto',
    marginTop: -20,
    width: 240,
    paddingHorizontal: 20,
  },
});
