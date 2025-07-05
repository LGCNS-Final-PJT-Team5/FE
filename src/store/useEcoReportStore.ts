import { create } from 'zustand';
import api from '../lib/axios';
import env from '../config/env';

// 타입 정의
interface IdlingEvent {
  startTime: string;
  endTime: string;
}

interface SpeedMaintainData {
  tag: string;
  ratio: number;
}

interface EcoReportData {
  score: number;
  idling: {
    score: number;
    feedback: string;
    graph: IdlingEvent[];
  };
  speedMaintain: {
    score: number;
    feedback: string;
    graph: SpeedMaintainData[];
  };
}

interface EcoReportState {
  data: EcoReportData | null;
  loading: boolean;
  error: string | null;
  fetchEcoReport: (driveId: string) => Promise<void>;
}

// Zustand 스토어 생성
const useEcoReportStore = create<EcoReportState>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  // API 호출 함수
  fetchEcoReport: async (driveId: string) => {
    try {
      set({ loading: true, error: null });
      
      console.log(`탄소 배출 리포트 요청: ${driveId}`);
      
      // API 호출 - 중앙화된 api 인스턴스 사용, 토큰은 인터셉터에서 처리
      const response = await api.get(env.API.DRIVING.ECO_REPORT(driveId));
      
      console.log('탄소 배출 API 응답 상태:', response.status);
      
      set({ data: response.data, loading: false });
      
    } catch (error) {
      console.error('탄소 배출 보고서 데이터 로딩 오류:', error);
      
      // 상세 오류 정보 출력
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : '데이터 로딩 중 오류가 발생했습니다'
      });
    }
  },
}));

export default useEcoReportStore;