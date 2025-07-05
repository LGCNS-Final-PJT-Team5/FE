import { SAFETY_COLORS } from '../theme/colors';

/**
 * 안전 운전 데이터 처리 함수
 */
export const processSafetyData = (data) => {
  // 급가감속 데이터 가공
  const formattedBarData = data.acceleration.chartData.map(item => ({
    value: item.value,
    label: item.label,
    frontColor: SAFETY_COLORS.chart.green,
    topLabelComponent: () => null,
  }));

  // 급회전 데이터 가공
  const pieData = [
    {
      value: data.turning.chartData.safe,
      color: SAFETY_COLORS.chart.green,
      name: '안전 회전',
      text: `${data.turning.chartData.safe}%`,
    },
    {
      value: data.turning.chartData.unsafe,
      color: SAFETY_COLORS.chart.red,
      name: '위험 회전',
      text: `${data.turning.chartData.unsafe}%`,
    },
  ];

  // 과속 데이터 가공
  const formattedLineData = data.speeding.chartData.map(item => ({
    value: item.value,
    label: item.label,
    dataPointText: item.value > data.speeding.speedLimit ? item.value.toString() : '',
  }));

  return {
    processedData: data,
    formattedBarData,
    pieData,
    formattedLineData
  };
};