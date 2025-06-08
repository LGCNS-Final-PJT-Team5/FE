import { create } from 'zustand';
import api from '../lib/axios'; // 중앙화된 axios 인스턴스 사용
import { DrivingDetailData } from '../types/driving';
import env from '../config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      
      // AsyncStorage에서 직접 토큰 가져오기 (안정성 높임)
      const token = await AsyncStorage.getItem('jwtToken');
      
      console.log(`Fetching drive detail for ID: ${driveId}`);
      console.log(`Authorization token: ${token ? 'Found' : 'Not found'}`);
      
      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // X-User-Id 헤더도 추가 (필요한 경우)
      if (userId) {
        headers['X-User-Id'] = userId;
      }
      
      const response = await api.get(env.API.DRIVING.DETAIL(driveId), { headers });
      
      console.log("API 응답:", response.status, response.statusText);
      
      const apiData = response.data;
      
      // 데이터 변환 및 설정
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
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
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