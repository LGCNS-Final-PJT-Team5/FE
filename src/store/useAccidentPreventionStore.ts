import { create } from 'zustand';
import api from '../lib/axios'; // 중앙화된 인스턴스 사용
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
      
      console.log(`사고 예방 리포트 요청: ${driveId}`);
      
      // 중앙화된 api 인스턴스 사용
      const response = await api.get(env.API.DRIVING.PREVENTION_REPORT(driveId));
      
      console.log('사고 예방 API 응답 상태:', response.status);
      
      // 성공 시 데이터 저장
      set({ 
        data: response.data, 
        loading: false 
      });
    } catch (error) {
      // 에러 처리 상세화
      console.error('사고 예방 데이터 가져오기 실패:', error);
      
      // 상세 오류 정보 출력
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      set({ 
        error: '사고 예방 데이터를 불러오는 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  }
}));

export default useAccidentPreventionStore;