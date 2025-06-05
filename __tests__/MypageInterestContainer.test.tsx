import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import {MypageInterestContainer} from '../src/containers/Mypage/MypageInterestContainer';
import {userService} from '../src/services/api/userService';

// Mock dependencies
jest.mock('../src/services/api/userService');

const TEST_ID = {
  INTEREST_SCREEN: 'interest-screen',
  VALUE_DISPLAY: 'value-display',
  SET_VALUE_BUTTON: 'set-value-btn',
  SAVE_BUTTON: 'save-btn',
  SUCCESS_MODAL: 'success-modal',
  MODAL_CLOSE_BUTTON: 'modal-close-btn',
};

jest.mock('../src/screens/Mypage/subpage/MypageInterestScreen', () => ({
  __esModule: true,
  default: jest.fn(({value, setValue, setInterest}) => {
    const {View, Text, TouchableOpacity} = require('react-native');
    return (
      <View testID={TEST_ID.INTEREST_SCREEN}>
        <Text testID={TEST_ID.VALUE_DISPLAY}>{value}</Text>
        <TouchableOpacity
          testID={TEST_ID.SET_VALUE_BUTTON}
          onPress={() => setValue('보험료')}>
          <Text>보험료 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity testID={TEST_ID.SAVE_BUTTON} onPress={setInterest}>
          <Text>저장</Text>
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

describe('MypageInterestContainer', () => {
  const mockGetMyInterest = userService.getMyInterest as jest.MockedFunction<
    typeof userService.getMyInterest
  >;
  const mockUpdateInterest = userService.updateInterest as jest.MockedFunction<
    typeof userService.updateInterest
  >;
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  const InterestScreenMock =
    require('../src/screens/Mypage/subpage/MypageInterestScreen').default;
  const CustomModalMock =
    require('../src/components/common/CustomModal').default;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockClear();
  });

  it('로딩 중에는 아무것도 렌더링하지 않는다', async () => {
    let resolve: (v: string) => void = () => {};
    mockGetMyInterest.mockImplementation(
      () =>
        new Promise(r => {
          resolve = r;
        }),
    );
    const {queryByTestId} = render(<MypageInterestContainer />);
    expect(queryByTestId(TEST_ID.INTEREST_SCREEN)).toBeNull();
    // resolve를 호출해도 이후 테스트에서 영향 없도록 함
    resolve('연비');
  });

  it('관심사 조회 성공 시 value가 프리젠테이션 컴포넌트에 전달된다', async () => {
    mockGetMyInterest.mockResolvedValue('연비');
    render(<MypageInterestContainer />);
    await waitFor(() => expect(InterestScreenMock).toHaveBeenCalled());
    const props = InterestScreenMock.mock.calls.at(-1)[0];
    expect(props.value).toBe('연비');
  });

  it('관심사 선택(setValue) 시 value가 변경된다', async () => {
    mockGetMyInterest.mockResolvedValue('연비');
    render(<MypageInterestContainer />);
    await waitFor(() => expect(InterestScreenMock).toHaveBeenCalled());
    const props = InterestScreenMock.mock.calls.at(-1)[0];
    act(() => {
      props.setValue('보험료');
    });
    await waitFor(() => {
      const latestProps = InterestScreenMock.mock.calls.at(-1)[0];
      expect(latestProps.value).toBe('보험료');
    });
  });

  it('관심사 저장(setInterest) 시 updateInterest API 호출 및 모달 노출', async () => {
    mockGetMyInterest.mockResolvedValue('연비');
    mockUpdateInterest.mockResolvedValue(undefined);
    render(<MypageInterestContainer />);
    await waitFor(() => expect(InterestScreenMock).toHaveBeenCalled());
    const props = InterestScreenMock.mock.calls.at(-1)[0];
    act(() => {
      props.setValue('보험료');
    });
    await waitFor(() => {
      const latestProps = InterestScreenMock.mock.calls.at(-1)[0];
      expect(latestProps.value).toBe('보험료');
    });
    const latestProps = InterestScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await latestProps.setInterest();
    });
    expect(mockUpdateInterest).toHaveBeenCalledWith('보험료');
    expect(
      CustomModalMock.mock.calls.some(
        (call: any) =>
          call[0].visible === true && call[0].title === '저장 완료',
      ),
    ).toBe(true);
  });

  it('모달 닫기(onClose) 시 모달이 닫힌다', async () => {
    mockGetMyInterest.mockResolvedValue('연비');
    mockUpdateInterest.mockResolvedValue(undefined);
    render(<MypageInterestContainer />);
    await waitFor(() => expect(InterestScreenMock).toHaveBeenCalled());
    const props = InterestScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await props.setInterest();
    });
    // 모달이 열렸는지 확인
    expect(
      CustomModalMock.mock.calls.some(
        (call: any) =>
          call[0].visible === true && call[0].title === '저장 완료',
      ),
    ).toBe(true);
    // 모달 닫기
    const modalProps = CustomModalMock.mock.calls.find(
      (call: any) => call[0].visible === true && call[0].title === '저장 완료',
    )?.[0];
    expect(modalProps).toBeDefined();
    if (modalProps && typeof modalProps.onClose === 'function') {
      act(() => {
        modalProps.onClose();
      });
    }
    const lastModalCall = CustomModalMock.mock.calls.at(-1)?.[0];
    expect(lastModalCall).toMatchObject({visible: false, title: '저장 완료'});
  });

  it('관심사 조회/저장 실패 시 콘솔 에러 발생', async () => {
    mockGetMyInterest.mockRejectedValueOnce(new Error('조회 실패'));
    render(<MypageInterestContainer />);
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '관심사 조회 실패',
        expect.any(Error),
      );
    });

    mockGetMyInterest.mockResolvedValue('연비');
    mockUpdateInterest.mockRejectedValueOnce(new Error('저장 실패'));
    render(<MypageInterestContainer />);
    await waitFor(() => expect(InterestScreenMock).toHaveBeenCalled());
    const props = InterestScreenMock.mock.calls.at(-1)[0];
    await act(async () => {
      await props.setInterest();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '관심사 저장 실패',
      expect.any(Error),
    );
  });
});
