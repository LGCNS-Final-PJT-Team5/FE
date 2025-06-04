import { create } from 'zustand';
import axios from 'axios';
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
      
      // 중앙화된 API URL 사용
      const response = await axios.get(env.API.DRIVING.ATTENTION_REPORT(driveId), {
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
      console.error('주의력 점수 데이터 가져오기 실패:', error);
      set({ 
        error: '주의력 점수 데이터를 불러오는 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  }
}));

export default useAttentionReportStore;