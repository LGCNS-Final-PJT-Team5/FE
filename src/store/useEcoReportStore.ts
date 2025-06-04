import { create } from 'zustand';
import axios from 'axios';
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
      
      // API 호출
      const response = await axios.get(
        env.API.DRIVING.ECO_REPORT(driveId),
        {
          headers: {
            'X-User-Id': '1', // 사용자 ID 헤더 추가
          }
        }
      );
      
      // 데이터 저장
      set({ 
        data: response.data, 
        loading: false 
      });
      
    } catch (error) {
      console.error('탄소 배출 보고서 데이터 로딩 오류:', error);
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : '데이터 로딩 중 오류가 발생했습니다' 
      });
    }
  },
}));

export default useEcoReportStore;