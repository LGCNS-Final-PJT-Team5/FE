import { create } from 'zustand';
import axios from 'axios';
import env from '../config/env';
import { DriveHistoryItem } from '../types/driving';

interface DrivingHistoryState {
  driveHistory: DriveHistoryItem[];
  isLoading: boolean;
  error: string | null;
  fetchDriveHistory: () => Promise<void>;
  getDriveDetail: (driveId: string) => Promise<DriveHistoryItem | undefined>;
}

export const useDrivingHistoryStore = create<DrivingHistoryState>((set, get) => ({
  driveHistory: [],
  isLoading: false,
  error: null,
  
  fetchDriveHistory: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // 디버깅 메시지 추가
      console.log("=== 네트워크 요청 시작 ===");
      console.log(`API URL: ${env.API.DRIVING.HISTORY}`);
      
      // 2. 타임아웃 설정 추가 (5초)
      const response = await axios.get(env.API.DRIVING.HISTORY, {
        headers: { 'X-User-Id': '1' },
        timeout: 5000
      });
      
      console.log("API 응답 전체:", JSON.stringify(response));
      console.log("API 응답 상태:", response.status);
      console.log("API 응답 데이터:", response.data);
      
      // 응답이 구조화된 객체인지 확인하고 list 속성 확인
      const dataArray = response.data?.list
        ? Array.isArray(response.data.list) 
           ? response.data.list 
           : []
        : (Array.isArray(response.data) ? response.data : []);
      
      // 데이터가 비어있는 경우 명시적 처리
      if (dataArray.length === 0) {
        console.log("주행 기록 데이터가 없습니다");
        set({ driveHistory: [], isLoading: false });
        return;
      }
      
      // API 응답 형식에 맞게 데이터 변환
      const formattedData: DriveHistoryItem[] = dataArray.map((item: any) => ({
        driveId: item.driveId || item.id || '',
        date: item.startTime ? item.startTime.substring(0, 10) : '', // 날짜 추출
        startTime: item.startTime || '',
        endTime: item.endTime || '',
        summaryScore: item.score || 0
      }));
      
      set({ driveHistory: formattedData, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch drive history:", error);
      
      // 명시적으로 로딩 상태 해제 (중요!)
      set({ isLoading: false });
      
      // 에러 상세 정보 제공
      if (axios.isAxiosError(error)) {
        // 요청 실패한 URL 로깅
        console.error("요청 실패한 URL:", error.config?.url);
        console.error("요청 헤더:", error.config?.headers);
        
        if (error.response) {
          // 서버에서 응답이 왔지만 오류 상태 코드
          set({ error: `서버 오류: ${error.response.status} - ${error.response.statusText}` });
        } else if (error.request) {
          // 요청은 보냈지만 응답이 없음 (네트워크 문제)
          set({ error: "서버로부터 응답이 없습니다. 네트워크 연결을 확인해주세요." });
        } else {
          // 요청 설정 자체에 문제
          set({ error: `요청 오류: ${error.message}` });
        }
      } else {
        set({ error: "알 수 없는 오류가 발생했습니다" });
      }
    }
  },
  
  getDriveDetail: async (driveId: string) => {
    const { driveHistory } = get();
    return driveHistory.find(item => item.driveId === driveId);
  }
}));