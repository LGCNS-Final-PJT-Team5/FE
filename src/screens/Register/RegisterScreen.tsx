import React, {Dispatch, SetStateAction, RefObject} from 'react';
import {View, StyleSheet} from 'react-native';
import PagerView from 'react-native-pager-view';
import RegisterNicknameView from './subpage/RegisterNicknameView.tsx';
import RegisterCarNumScreen from './subpage/RegisterCarNumScreen.tsx';
import RegisterDriveScreen from './subpage/RegisterDriveScreen.tsx';
import RegisterInterestScreen from './subpage/RegisterInterestScreen.tsx';
import {RegisterNavigator} from '../../components/Register/RegisterNavigator.tsx';
import {RegisterIndicator} from '../../components/Register/RegisterIndicator.tsx';

type RegisterProps = {
  pageIndex: number;
  nickname: string;
  drive: string;
  carNum: string;
  interest: string;
  setNickname: Dispatch<SetStateAction<string>>;
  setDrive: Dispatch<SetStateAction<string>>;
  setCarNum: Dispatch<SetStateAction<string>>;
  setInterest: Dispatch<SetStateAction<string>>;
  goToPrior: () => void;
  goToNext: () => void;
  close: () => void;
  pagerRef: RefObject<PagerView | null>;
  setShowAlertModal: Dispatch<SetStateAction<boolean>>;
  setAlertMessage: Dispatch<SetStateAction<string>>;
  register: () => void;
  modals: React.ReactNode;
};

export const RegisterScreen = ({
  pageIndex,
  nickname,
  drive,
  carNum,
  interest,
  setNickname,
  setDrive,
  setCarNum,
  setInterest,
  goToPrior,
  goToNext,
  close,
  pagerRef,
  setShowAlertModal,
  setAlertMessage,
  register,
  modals,
}: RegisterProps) => {
  return (
    <>
      <View style={styles.flexView}>
        <RegisterNavigator
          pageIndex={pageIndex}
          goToPrior={goToPrior}
          close={close}
        />
        <RegisterIndicator pageIndex={pageIndex} />
        <PagerView style={styles.pagerView} initialPage={0} ref={pagerRef}>
          <View key="0" style={styles.page}>
            <RegisterNicknameView
              text={nickname}
              setText={setNickname}
              moveNext={goToNext}
              setShowAlertModal={setShowAlertModal}
              setAlertMessage={setAlertMessage}
            />
          </View>
          <View key="1" style={styles.page}>
            <RegisterDriveScreen
              value={drive}
              setValues={setDrive}
              moveNext={goToNext}
              setShowAlertModal={setShowAlertModal}
              setAlertMessage={setAlertMessage}
            />
          </View>
          <View key="2" style={styles.page}>
            <RegisterCarNumScreen
              text={carNum}
              setText={setCarNum}
              moveNext={goToNext}
              setShowAlertModal={setShowAlertModal}
              setAlertMessage={setAlertMessage}
            />
          </View>
          <View key="3" style={styles.page}>
            <RegisterInterestScreen
              value={interest}
              setValue={setInterest}
              register={register}
              setShowAlertModal={setShowAlertModal}
              setAlertMessage={setAlertMessage}
            />
          </View>
        </PagerView>
      </View>
      {modals}
    </>
  );
};

const styles = StyleSheet.create({
  flexView: {
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    marginTop: 120,
    alignItems: 'center',
  },
});
