import { create } from 'zustand';
import api from '../lib/axios'; // 중앙화된 인스턴스 사용
import env from '../config/env';

// 스토어 상태 타입 정의
interface SafetyReportState {
  data: any | null;
  loading: boolean;
  error: string | null;
  fetchSafetyReport: (driveId: string) => Promise<void>;
}

// Zustand 스토어 생성
const useSafetyReportStore = create<SafetyReportState>((set) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchSafetyReport: async (driveId: string) => {
    try {
      set({ loading: true, error: null });
      
      console.log(`안전 운전 리포트 요청: ${driveId}`);
      
      // 중앙화된 api 인스턴스 사용 (axios 직접 사용 대신)
      const response = await api.get(env.API.DRIVING.SAFETY_REPORT(driveId));
      
      console.log('안전 운전 API 응답 상태:', response.status);
      
      // 성공 시 데이터 저장
      set({ 
        data: response.data, 
        loading: false 
      });
    } catch (error) {
      // 에러 처리 상세화
      console.error('안전 운전 데이터 가져오기 실패:', error);
      
      // 상세 오류 정보 출력
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      
      set({ 
        error: '안전 운전 데이터를 불러오는 중 오류가 발생했습니다.', 
        loading: false 
      });
    }
  }
}));

export default useSafetyReportStore;