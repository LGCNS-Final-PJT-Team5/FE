import React, {useEffect, useState} from 'react';
import {DrivingAnalysis, DrivingRecommendations} from '../../types/report';
import ReportScreen from '../../screens/Dashboard/ReportScreen';
import { dashboardService } from '../../services/api/dashboardService';
import { DrivingReportResponse } from '../../types/dashboard';

export default function ReportContainer() {
  const [analysis, setAnalysis] = useState<DrivingAnalysis>({
    title: '주행 분석 결과',
    summary: '데이터를 불러오고 있습니다...',
    data: [],
  });

  const [recommendations, setRecommendations] = useState<DrivingRecommendations>({
    title: '맞춤 조언을 불러오고 있습니다...',
    summary: '데이터를 불러오고 있습니다...',
    tips: [],
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response: DrivingReportResponse = await dashboardService.getDrivingReport();
        
        // 점수별 색상 매핑 함수
        const getScoreColor = (score: number): string => {
          if (score >= 90) return '#68C179';
          if (score >= 80) return '#F6A43C';
          if (score >= 70) return '#F47F6B';
          return '#E74C3C';
        };

        // Analysis 데이터 매핑 - 주요 점수들만 선별
        const analysisData: DrivingAnalysis = {
          title: response.totalFeedback.title,
          summary: response.totalFeedback.content,
          data: [
            {
              label: '종합 점수',
              value: Math.round(response.scores.totalScore),
              color: getScoreColor(response.scores.totalScore),
            },
            {
              label: '친환경 점수',
              value: Math.round(response.scores.ecoScore),
              color: getScoreColor(response.scores.ecoScore),
            },
            {
              label: '안전 점수', 
              value: Math.round(response.scores.safetyScore),
              color: getScoreColor(response.scores.safetyScore),
            },
            {
              label: '가속 점수',
              value: Math.round(response.scores.accelerationScore),
              color: getScoreColor(response.scores.accelerationScore),
            },
            {
              label: '정속 주행',
              value: Math.round(response.scores.speedMaintainScore),
              color: getScoreColor(response.scores.speedMaintainScore),
            },
          ],
        };

        // Recommendations 데이터 매핑
        const recommendationsData: DrivingRecommendations = {
          title: response.detailedFeedback.title, // 응답에서 직접 사용
          summary: response.detailedFeedback.content,
          tips: response.detailedFeedback.feedback.map(feedback => ({
            text: feedback
          })),
        };

        setAnalysis(analysisData);
        setRecommendations(recommendationsData);
      } catch (error: any) {
        console.warn('리포트 데이터 조회 실패:', error);
        
        // 404 에러 처리 (주간 주행 데이터가 없는 경우)
        if (error?.response?.status === 404) {
          setAnalysis({
            title: '이번 주 주행 데이터가 없습니다',
            summary: '아직 이번 주에 주행한 기록이 없어서 분석할 데이터가 부족합니다. 주행 후 다시 확인해주세요.',
            data: [],
          });
          
          setRecommendations({
            title: '주행을 시작해보세요!',
            summary: '주행 후 맞춤형 조언을 받아보실 수 있습니다.',
            tips: [
              { text: '🚗 안전한 주행을 위해 출발 전 차량 점검을 해주세요.' },
              { text: '🛣️ 교통법규를 준수하며 안전운전 하세요.' },
              { text: '⛽ 경제적인 운전을 위해 급가속과 급제동을 피해주세요.' },
              { text: '📱 주행 중 스마트폰 사용을 자제해주세요.' },
            ],
          });
        } else {
          // 기타 에러 처리
          setAnalysis({
            title: '데이터 조회 실패',
            summary: '리포트 데이터를 불러올 수 없습니다. 네트워크 연결을 확인하고 다시 시도해주세요.',
            data: [],
          });
          
          setRecommendations({
            title: '추천사항 조회 실패',
            summary: '추천사항을 불러올 수 없습니다.',
            tips: [
              { text: '네트워크 연결을 확인해주세요.' },
              { text: '잠시 후 다시 시도해주세요.' }
            ],
          });
        }
      }
    };

    fetchReportData();
  }, []);

  return <ReportScreen analysis={analysis} recommendations={recommendations} />;
}