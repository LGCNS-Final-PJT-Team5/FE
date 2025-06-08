import { create } from 'zustand';
import api from '../lib/axios'; // 중앙화된 인스턴스 사용
import env from '../config/env';

// 주의력 리포트 데이터 타입 정의
interface AttentionReportData {
  score: number;
  drivingTime: {
    score: number;
    feedback: string;
    graph: {
      startTime: string;
      endTime: string;
    }[];
  };
  inactivity: {
    score: number;
    feedback: string;
    graph: string[];
  };
}

// 스토어 상태 타입 정의
interface AttentionReportState {
  data: AttentionReportData | null;
  loading: boolean;
  error: string | null;
  fetchAttentionReport: (driveId: string) => Promise<void>;
}

// Zustand 스토어 생성
const useAttentionReportStore = create<AttentionReportState>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchAttentionReport: async (driveId: string) => {
    try {
      set({ loading: true, error: null });
      
      console.log(`주의력 점수 리포트 요청: ${driveId}`);
      
      // 중앙화된 api 인스턴스 사용
      const response = await api.get(env.API.DRIVING.ATTENTION_REPORT(driveId));
      
      console.log('주의력 점수 API 응답 상태:', response.status);
      
      // 성공 시 데이터 저장
      set({ 
        data: response.data, 
        loading: false 
      });
    } catch (error) {
      // 에러 처리 상세화
      console.error('주의력 점수 데이터 가져오기 실패:', error);
      
      // 상세 오류 정보 출력
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      set({ 
        error: '주의력 점수 데이터를 불러오는 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  }
}));

export default useAttentionReportStore;