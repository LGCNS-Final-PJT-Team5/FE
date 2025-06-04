// screens/Register/SocialLoginScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Logo from '../../assets/modive_logo.svg';

export default function SocialLoginScreen({
  onPressLogin,
}: {
  onPressLogin: () => void;
}) {
  return (
    <View style={styles.container}>
      <Logo style={styles.image} width={243} height={243} />
      <View style={styles.textContainer}>
        <Text style={styles.text}> 운전의 패턴을 읽고, 데이터로 말하다.</Text>
        <Text style={styles.text}>
          {' '}
          운전 MoBTI는 무엇일까요? 지금 시작해보세요.
        </Text>
      </View>
      <TouchableOpacity onPress={onPressLogin}>
        <Image
          style={styles.kakaoButton}
          source={require('../../assets/kakao_login.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  image: {
    marginTop: '50%',
    marginLeft: 36,
  },
  textContainer: {
    gap: 4,
  },
  text: {
    marginLeft: 36,
    fontSize: 16,
    fontWeight: '600',
    color: '#565656',
  },
  kakaoButton: {
    alignSelf: 'center',
    marginTop: 5,
    width: 330,
    resizeMode: 'contain',
  },
});
