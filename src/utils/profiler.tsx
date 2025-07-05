import React, { Profiler, ReactNode, ProfilerOnRenderCallback } from 'react';

// 성능 로그를 저장할 배열
export const performanceLogs: Array<{
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  timestamp: string;
  component?: string;
}> = [];

interface ProfilerWrapperProps {
  id: string;             // 프로파일링 ID (컴포넌트 식별자)
  children: ReactNode;    // 자식 컴포넌트
  warnThreshold?: number; // 경고 임계값 (ms)
  logToConsole?: boolean; // 콘솔에 로그 출력 여부
  component?: string;     // 컴포넌트 이름 (선택 사항)
}

/**
 * 개발 모드에서만 작동하는 프로파일러 래퍼 컴포넌트
 */
export const ProfilerWrapper: React.FC<ProfilerWrapperProps> = ({
  id,
  children,
  warnThreshold = 16, // 60fps = 16.67ms
  logToConsole = true,
  component
}) => {
  // 개발 모드가 아니면 프로파일링 없이 자식만 렌더링
  if (!__DEV__) {
    return <>{children}</>;
  }

  // 프로파일러 콜백 함수
  const handleProfilerRender: ProfilerOnRenderCallback = (
    profilerID,  // Profiler에 지정한 ID
    phase,       // "mount"(첫 렌더링) 또는 "update"(리렌더링)
    actualDuration, // 실제 렌더링에 걸린 시간 (ms)
    baseDuration,   // 메모이제이션 없이 렌더링했을 때 예상 시간 (ms)
    startTime,      // 렌더링 시작 타임스탬프
    commitTime      // 렌더링 완료 타임스탬프
  ) => {
    // 성능 데이터 생성
    const logEntry = {
      id: profilerID,
      phase,
      actualDuration,
      baseDuration,
      timestamp: new Date().toISOString(),
      component: component || 'Unknown'
    };
    
    // 성능 로그 배열에 추가
    performanceLogs.push(logEntry);
    
    // 콘솔에 로그 출력 (옵션)
    if (logToConsole) {
      console.log(
        `%c[Profiler] ${component || profilerID} ${phase}`,
        'color: #4C8BF5; font-weight: bold;',
        `\n  ⏱️ 렌더링 시간: ${actualDuration.toFixed(2)}ms`
      );
      
      // 기준치보다 느린 렌더링 감지 시 경고
      if (actualDuration > warnThreshold) {
        console.warn(
          `%c⚠️ 성능 주의 ${component || profilerID}`,
          'color: #FFA500; font-weight: bold;',
          `\n  렌더링 시간 ${actualDuration.toFixed(2)}ms > ${warnThreshold}ms (60fps)`
        );
      }
    }
  };

  // Profiler로 감싸서 반환
  return (
    <Profiler id={id} onRender={handleProfilerRender}>
      {children}
    </Profiler>
  );
};

/**
 * 성능 로그를 내보내는 함수 (개발용)
 * @returns JSON 형식의 성능 로그
 */
export const exportPerformanceLogs = () => {
  return JSON.stringify(performanceLogs, null, 2);
};

/**
 * 성능 로그 초기화 함수
 */
export const clearPerformanceLogs = () => {
  performanceLogs.length = 0;
};

/**
 * 성능 로그 요약 함수 - 컴포넌트별 평균 렌더링 시간 계산
 */
export const getPerformanceSummary = () => {
  const summary: Record<string, { count: number; totalTime: number; avgTime: number }> = {};
  
  performanceLogs.forEach(log => {
    const key = log.component || log.id;
    if (!summary[key]) {
      summary[key] = { count: 0, totalTime: 0, avgTime: 0 };
    }
    
    summary[key].count += 1;
    summary[key].totalTime += log.actualDuration;
  });
  
  // 평균 계산
  Object.keys(summary).forEach(key => {
    summary[key].avgTime = summary[key].totalTime / summary[key].count;
  });
  
  return summary;
};