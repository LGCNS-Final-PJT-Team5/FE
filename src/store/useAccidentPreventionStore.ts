import { create } from 'zustand';
import axios from 'axios';
import env from '../config/env';

// 사고예방 리포트 데이터 타입 정의
interface AccidentPreventionReportData {
  score: number;
  reaction: {
    score: number;
    feedback: string;
    graph: string[] | null;
  };
  laneDeparture: {
    score: number;
    feedback: string;
    graph: string[] | null;
  };
  followingDistance: {
    score: number;
    feedback: string;
    graph: string[] | null;
  };
}

// 스토어 상태 타입 정의
interface AccidentPreventionReportState {
  data: AccidentPreventionReportData | null;
  loading: boolean;
  error: string | null;
  fetchAccidentPreventionReport: (driveId: string) => Promise<void>;
}

// Zustand 스토어 생성
const useAccidentPreventionStore = create<AccidentPreventionReportState>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchAccidentPreventionReport: async (driveId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await axios.get(env.API.DRIVING.PREVENTION_REPORT(driveId), {
        headers: {
          'X-User-Id': '1' // 사용자 ID 추가
        }
      });
      
      // 성공 시 데이터 저장
      set({ 
        data: response.data, 
        loading: false 
      });
    } catch (error) {
      // 에러 처리
      console.error('사고 예방 데이터 가져오기 실패:', error);
      set({ 
        error: '사고 예방 데이터를 불러오는 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  }
}));

export default useAccidentPreventionStore;