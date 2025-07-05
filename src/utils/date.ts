// 날짜 포맷 함수
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  
  return `${year}.${month}.${day}.(${dayOfWeek})`;
};

// 시간 및 소요 시간 포맷 함수
export const formatTime = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const startHours = String(start.getHours()).padStart(2, '0');
  const startMinutes = String(start.getMinutes()).padStart(2, '0');
  const endHours = String(end.getHours()).padStart(2, '0');
  const endMinutes = String(end.getMinutes()).padStart(2, '0');
  
  // 소요 시간 계산 (분 단위)
  const durationMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  let durationText = '';
  if (hours > 0) {
    durationText = `${hours}시간 ${minutes}분`;
  } else {
    durationText = `${minutes}분`;
  }
  
  return `${startHours}:${startMinutes}~${endHours}:${endMinutes}(${durationText})`;
};
