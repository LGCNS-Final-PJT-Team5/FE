import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {DashboardResponse} from '../../../types/dashboard';
import {getMobtiMeta, getMobtiType} from '../../../utils/mobti';

export default function MobtiBox({dashboard}: {dashboard: DashboardResponse}) {
  // Todo
  // 점수에 따른 Mobti 설정
  const totalScore = Number.isInteger(dashboard.scores.totalScore)
    ? dashboard.scores.totalScore.toString()
    : dashboard.scores.totalScore.toFixed(2);

  const mobtiType = getMobtiType(dashboard.scores);
  const {image: mobtiImage, label: mobtiLabel} = getMobtiMeta(mobtiType);
  const isDefault = mobtiType === 'DEFAULT';

  return (
    <View style={styles.mobtiBox}>
      <Image source={mobtiImage} style={styles.mobtiImg} />
      <View style={styles.mobtiTextBox}>
        <Text style={styles.mobtiLabel}>Mobti</Text>
        <Text style={styles.mobtiTitle}>
          <Text style={styles.mobtiType}>
            {isDefault ? '환영합니다!' : mobtiType}
          </Text>
          {'\n'}
          <Text style={isDefault && {color: '#707070'}}>{mobtiLabel}</Text>
        </Text>
        <Text style={styles.scoreText}>
          종합점수 <Text style={styles.scoreValue}>{totalScore}</Text>
          <Text style={{color: '#EC008C'}}>점</Text>
        </Text>
        <View style={styles.scoreBar}>
          <View style={{borderRadius: 15, overflow: 'hidden'}}>
            <LinearGradient
              colors={['#CCCCFF', '#4945FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[
                styles.scoreProgress,
                {width: `${parseFloat(totalScore)}%`},
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobtiBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5FD',
    borderRadius: 15,
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
  },
  mobtiImg: {
    borderRadius: 15,
    width: 122,
    height: 122,
    marginRight: 15,
  },
  mobtiTextBox: {
    flex: 1,
  },
  mobtiLabel: {
    fontSize: 15,
    color: '#222',
  },
  mobtiTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    color: '#4945FF',
  },
  mobtiType: {
    fontSize: 22,
    color: '#4945FF',
    fontWeight: 'bold',
  },
  scoreText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4945FF',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EC008C',
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
