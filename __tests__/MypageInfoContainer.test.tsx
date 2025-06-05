import React from 'react';
import {render, screen, act, waitFor} from '@testing-library/react-native';
import {MypageInfoContainer} from '../src/containers/Mypage/MypageInfoContainer';
import {useUserStore, UserStore} from '../src/store/useUserStore';
import {useAuthStore} from '../src/store/useAuthStore';
import {userService} from '../src/services/api/userService';
import {UserResponse} from '../src/types/user';
import {Text, Button} from 'react-native';

// Mock dependencies
jest.mock('../src/store/useUserStore');
jest.mock('../src/store/useAuthStore');
jest.mock('../src/services/api/userService');

const TEST_ID = {
  MYPAGE_INFO_SCREEN: 'mypage-info-screen',
  NAME_DISPLAY: 'name-display',
  NICKNAME_INPUT: 'nickname-input',
  EMAIL_DISPLAY: 'email-display',
  SAVE_BUTTON: 'save-button',
  WITHDRAW_BUTTON: 'withdraw-button',
  SUCCESS_MODAL: 'success-modal',
  MODAL_CLOSE_BUTTON: 'modal-close-button',
};

jest.mock('../src/screens/Mypage/subpage/MypageInfoScreen', () => ({
  __esModule: true,
  default: jest.fn(props => {
    const {View, Text, TextInput, TouchableOpacity} = require('react-native');
    return (
      <View testID={TEST_ID.MYPAGE_INFO_SCREEN}>
        <Text testID={TEST_ID.NAME_DISPLAY}>{props.name}</Text>
        <TextInput
          testID={TEST_ID.NICKNAME_INPUT}
          value={props.nickname}
          editable={false}
        />
        <Text testID={TEST_ID.EMAIL_DISPLAY}>{props.email}</Text>
        <TouchableOpacity testID={TEST_ID.SAVE_BUTTON} onPress={props.save}>
          <Text>저장</Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID={TEST_ID.WITHDRAW_BUTTON}
          onPress={props.onWithdraw}>
          <Text>회원탈퇴</Text>
        </TouchableOpacity>
      </View>
    );
  }),
}));

jest.mock('../src/components/common/CustomModal', () => ({
  __esModule: true,
  default: jest.fn(props => {
    const {View, Text, TouchableOpacity} = require('react-native');
    if (!props.visible) return null;
    return (
      <View testID={TEST_ID.SUCCESS_MODAL}>
        <Text>{props.title}</Text>
        <TouchableOpacity
          testID={TEST_ID.MODAL_CLOSE_BUTTON}
          onPress={props.onClose}>
          <Text>닫기</Text>
        </TouchableOpacity>
      </View>
    );
  }),
}));

const mockUser: UserResponse = {
  name: '김모디',
  nickname: '모디유저',
  email: 'modi@example.com',
  alarm: true,
  reward: 100,
};

// Store mocks and default states
const mockSetUserAction = jest.fn();
const mockUserStoreDefaultState: UserStore = {
  user: mockUser,
  setUser: mockSetUserAction,
  clearUser: jest.fn(),
  setAlarm: jest.fn(),
  reset: jest.fn(),
  hasHydrated: true,
  setHasHydrated: jest.fn(),
};

const mockLogoutAction = jest.fn();
const mockAuthStoreDefaultState = {
  isLoggedIn: true,
  accessToken: 'token',
  refreshToken: 'refresh',
  login: jest.fn(),
  logout: mockLogoutAction,
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  setIsLoggedIn: jest.fn(),
};

describe('MypageInfoContainer', () => {
  const mockUseUserStore = useUserStore as jest.MockedFunction<
    typeof useUserStore
  >;
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  const mockUpdateNickname = userService.updateNickname as jest.MockedFunction<
    typeof userService.updateNickname
  >;
  const mockGetMyInfo = userService.getMyInfo as jest.MockedFunction<
    typeof userService.getMyInfo
  >;
  const mockDeleteMyAccount =
    userService.deleteMyAccount as jest.MockedFunction<
      typeof userService.deleteMyAccount
    >;
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  // mock 객체 import
  const MypageInfoScreenMock =
    require('../src/screens/Mypage/subpage/MypageInfoScreen').default;
  const CustomModalMock =
    require('../src/components/common/CustomModal').default;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
    mockSetUserAction.mockClear();
    mockLogoutAction.mockClear();

    mockUseUserStore.mockImplementation(cb => cb(mockUserStoreDefaultState));
    mockUseAuthStore.mockImplementation(cb => cb(mockAuthStoreDefaultState));
  });

  it('초기 렌더링 시 사용자 정보를 MypageInfoScreen에 올바르게 전달해야 합니다.', async () => {
    render(<MypageInfoContainer />);
    await waitFor(() => expect(MypageInfoScreenMock).toHaveBeenCalled());

    const screenProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    expect(screenProps.name).toBe(mockUser.name);
    expect(screenProps.nickname).toBe(mockUser.nickname);
    expect(screenProps.email).toBe(mockUser.email);
    expect(typeof screenProps.setNickname).toBe('function');
    expect(typeof screenProps.save).toBe('function');
    expect(typeof screenProps.onWithdraw).toBe('function');
  });

  it('닉네임 변경 및 저장 성공 시 API 호출, 스토어 업데이트, 성공 모달 표시 후 닫기를 수행해야 합니다.', async () => {
    const newNickname = '새로운닉네임';
    const updatedUserInfo = {...mockUser, nickname: newNickname};
    mockGetMyInfo.mockResolvedValue(updatedUserInfo);

    render(<MypageInfoContainer />);
    await waitFor(() => expect(MypageInfoScreenMock).toHaveBeenCalled());

    const screenProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    act(() => {
      screenProps.setNickname(newNickname);
    });
    await waitFor(() => {
      const latestProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
      expect(latestProps.nickname).toBe(newNickname);
    });
    const latestProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await latestProps.save();
    });

    expect(mockUpdateNickname).toHaveBeenCalledWith(newNickname);
    expect(mockGetMyInfo).toHaveBeenCalledTimes(1);
    expect(mockSetUserAction).toHaveBeenCalledWith(updatedUserInfo);
    expect(
      CustomModalMock.mock.calls.some(
        (call: any) =>
          call[0].visible === true && call[0].title === '닉네임 변경 완료',
      ),
    ).toBe(true);

    const modalProps = CustomModalMock.mock.calls.find(
      (call: any) =>
        call[0].visible === true && call[0].title === '닉네임 변경 완료',
    )?.[0];
    expect(modalProps).toBeDefined();
    if (modalProps && typeof modalProps.onClose === 'function') {
      act(() => {
        modalProps.onClose();
      });
    }
    const lastModalCall = CustomModalMock.mock.calls.at(-1)?.[0];
    expect(lastModalCall).toMatchObject({
      visible: false,
      title: '닉네임 변경 완료',
    });
  });

  it('닉네임 저장 실패 시 콘솔 에러를 기록하고 성공 모달을 표시하지 않아야 합니다.', async () => {
    mockUpdateNickname.mockRejectedValueOnce(
      new Error('Update Nickname Failed'),
    );
    render(<MypageInfoContainer />);
    await waitFor(() => expect(MypageInfoScreenMock).toHaveBeenCalled());
    const screenProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await screenProps.save();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '닉네임 저장 실패',
      expect.any(Error),
    );
    expect(CustomModalMock).not.toHaveBeenCalledWith(
      expect.objectContaining({visible: true, title: '닉네임 변경 완료'}),
      {},
    );
  });

  it('회원 탈퇴 성공 시 API 호출 및 스토어 logout을 실행해야 합니다.', async () => {
    render(<MypageInfoContainer />);
    await waitFor(() => expect(MypageInfoScreenMock).toHaveBeenCalled());
    const screenProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await screenProps.onWithdraw();
    });
    expect(mockDeleteMyAccount).toHaveBeenCalledTimes(1);
    expect(mockLogoutAction).toHaveBeenCalledTimes(1);
  });

  it('회원 탈퇴 실패 시 콘솔 에러를 기록해야 합니다.', async () => {
    mockDeleteMyAccount.mockRejectedValueOnce(
      new Error('Delete Account Failed'),
    );
    render(<MypageInfoContainer />);
    await waitFor(() => expect(MypageInfoScreenMock).toHaveBeenCalled());
    const screenProps = MypageInfoScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await screenProps.onWithdraw();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '회원 탈퇴 실패',
      expect.any(Error),
    );
    expect(mockLogoutAction).not.toHaveBeenCalled();
  });
});
