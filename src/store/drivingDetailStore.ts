import { create } from 'zustand';
import axios from 'axios';
import { DrivingDetailData } from '../types/driving';
import env from '../config/env';

// API 응답 인터페이스 정의
interface DriveDetailResponse {
  userId: string;
  driveId: string;
  startTime: string;
  endTime: string;
  scores: {
    idlingScore: number;
    speedMaintainScore: number;
    ecoScore: number;
    accelerationScore: number;
    sharpTurnScore: number;
    overSpeedScore: number;
    safetyScore: number;
    reactionScore: number;
    laneDepartureScore: number;
    followingDistanceScore: number;
    accidentPreventionScore: number;
    drivingTimeScore: number;
    inactivityScore: number;
    attentionScore: number;
    totalScore: number;
  };
  feedback: string;
}

interface DrivingDetailState {
  driveDetail: DrivingDetailData | null;
  isLoading: boolean;
  error: string | null;
  fetchDriveDetail: (driveId: string, userId: string) => Promise<void>;
}

export const useDrivingDetailStore = create<DrivingDetailState>((set) => ({
  driveDetail: null,
  isLoading: false,
  error: null,
  
  fetchDriveDetail: async (driveId, userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.get(`${env.API_URL}/dashboard/post-drive/${driveId}`, {
        headers: {
          'X-User-Id': userId
        }
      });
      
      const apiData: DriveDetailResponse = response.data;
      
      // API 데이터를 UI에 맞는 형식으로 변환
      const formattedData: DrivingDetailData = {
        date: formatDate(apiData.startTime),
        time: formatTimeRange(apiData.startTime, apiData.endTime),
        totalScore: apiData.scores.totalScore,
        scores: [
          {
            name: '탄소 배출 및 연비 점수',
            value: apiData.scores.ecoScore,
            color: '#007AFF'
          },
          {
            name: '안전 운전 점수',
            value: apiData.scores.safetyScore,
            color: '#4ECD7B'
          },
          {
            name: '사고 예방 점수',
            value: apiData.scores.accidentPreventionScore,
            color: '#BB27FF'
          },
          {
            name: '주의력 점수',
            value: apiData.scores.attentionScore,
            color: '#FFD927'
          }
        ],
        message: apiData.feedback
      };
      
      set({ driveDetail: formattedData, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch drive detail:', error);
      set({ 
        error: '주행 상세 정보를 가져오는데 실패했습니다.',
        isLoading: false 
      });
    }
  }
}));

// 날짜 포맷팅 헬퍼 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 시간 범위 포맷팅 헬퍼 함수
function formatTimeRange(startTimeStr: string, endTimeStr: string): string {
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);
  
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };
  
  return `${formatTime(startTime)}~${formatTime(endTime)}까지 주행기록`;
}