import MypageInterestScreen from '../../screens/Mypage/subpage/MypageInterestScreen.tsx';
import {useEffect, useState} from 'react';
import {userService} from '../../services/api/userService';
import CustomModal from '../../components/common/CustomModal';

export const MypageInterestContainer = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const fetchInterest = async () => {
      try {
        const interest = await userService.getMyInterest();
        setValue(interest);
      } catch (error) {
        console.error('관심사 조회 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterest();
  }, []);

  const setInterest = async () => {
    try {
      await userService.updateInterest(value);
      setSuccessModalVisible(true);
    } catch (error) {
      console.error('관심사 저장 실패', error);
    }
  };

  if (loading) return null;

  return (
    <>
      <MypageInterestScreen
        value={value}
        setValue={setValue}
        setInterest={setInterest}
      />
      <CustomModal
        visible={successModalVisible}
        title="저장 완료"
        content={['관심사가 저장되었습니다.']}
        onClose={() => setSuccessModalVisible(false)}
        onConfirm={() => setSuccessModalVisible(false)}
        confirmText="확인"
      />
    </>
  );
};
