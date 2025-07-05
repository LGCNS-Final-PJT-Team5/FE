import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Logo from '../../assets/modive_logo.svg';

type Props = {
  leftType?: 'back' | 'logo' | 'none';
  rightType?: 'share' | 'edit' | 'close' | 'none';
  title?: string;
  onClosePress?: () => void;
};

function CustomHeader({
  leftType = 'none',
  rightType = 'none',
  title = '',
  onClosePress,
}: Props) {
  const navigation = useNavigation();

  const renderLeft = () => {
    if (leftType === 'back') {
      return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} />
        </TouchableOpacity>
      );
    }

    if (leftType === 'logo') {
      return <Logo width={100} height={24} />;
    }
    return <View style={{width: 24}} />;
  };

  const renderRight = () => {
    if (rightType === 'share') {
      return (
        <TouchableOpacity onPress={() => console.log('공유')}>
          <Feather name="share" size={24} />
        </TouchableOpacity>
      );
    }

    if (rightType === 'edit') {
      return (
        <TouchableOpacity onPress={() => console.log('편집')}>
          <Text style={styles.editText}>편집</Text>
        </TouchableOpacity>
      );
    }

    if (rightType === 'close') {
      return (
        <TouchableOpacity onPress={onClosePress}>
          <Feather name="x" size={24} />
        </TouchableOpacity>
      );
    }

    return <View style={{width: 24}} />;
  };

  return (
    <View style={styles.container}>
      {renderLeft()}
      <Text style={styles.title}>{title}</Text>
      {renderRight()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editText: {
    color: '#3B5BFF',
    fontWeight: 'bold',
  },
});

export default React.memo(CustomHeader);
