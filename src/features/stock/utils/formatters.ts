/**
 * 가격 포맷팅
 * @param price - 가격
 * @param currency - 통화 (기본: USD)
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @returns 포맷된 가격 문자열
 */
export function formatPrice(
  price: number,
  currency: string = 'USD',
  decimals: number = 2
): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '-';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(price);
}

/**
 * 숫자 포맷팅 (통화 기호 없이)
 * @param value - 숫자
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @returns 포맷된 숫자 문자열
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * 거래량 포맷팅 (K, M, B 단위)
 * @param volume - 거래량
 * @returns 포맷된 거래량 문자열
 */
export function formatVolume(volume: number): string {
  if (volume === null || volume === undefined || isNaN(volume)) {
    return '-';
  }

  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(2)}B`;
  }
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
  return volume.toLocaleString('en-US');
}

/**
 * 시가총액 포맷팅 (K, M, B, T 단위)
 * @param marketCap - 시가총액
 * @returns 포맷된 시가총액 문자열
 */
export function formatMarketCap(marketCap: number): string {
  if (marketCap === null || marketCap === undefined || isNaN(marketCap)) {
    return '-';
  }

  if (marketCap >= 1_000_000_000_000) {
    return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
  }
  if (marketCap >= 1_000_000) {
    return `$${(marketCap / 1_000_000).toFixed(2)}M`;
  }
  if (marketCap >= 1_000) {
    return `$${(marketCap / 1_000).toFixed(2)}K`;
  }
  return `$${marketCap.toLocaleString('en-US')}`;
}

/**
 * 퍼센트 포맷팅
 * @param value - 퍼센트 값
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @param showSign - 부호 표시 여부 (기본: true)
 * @returns 포맷된 퍼센트 문자열
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  showSign: boolean = true
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  const formatted = Math.abs(value).toFixed(decimals);
  const sign = showSign ? (value >= 0 ? '+' : '-') : (value < 0 ? '-' : '');

  return `${sign}${formatted}%`;
}

/**
 * 변동폭 포맷팅
 * @param change - 변동폭
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @returns 포맷된 변동폭 문자열
 */
export function formatChange(change: number, decimals: number = 2): string {
  if (change === null || change === undefined || isNaN(change)) {
    return '-';
  }

  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}`;
}

/**
 * 날짜 포맷팅
 * @param date - 날짜 문자열 또는 Date 객체
 * @param format - 포맷 ('short' | 'medium' | 'long' | 'time')
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'time' = 'medium'
): string {
  if (!date) {
    return '-';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '-';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'numeric', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric', weekday: 'short' },
    time: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  }[format];

  return dateObj.toLocaleDateString('ko-KR', options);
}

/**
 * 타임스탬프를 날짜 문자열로 변환
 * @param timestamp - Unix 타임스탬프 (밀리초)
 * @returns ISO 형식 날짜 문자열 (YYYY-MM-DD)
 */
export function timestampToDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0];
}

/**
 * 상승/하락 여부 확인
 * @param value - 값
 * @returns 'up' | 'down' | 'neutral'
 */
export function getChangeDirection(value: number): 'up' | 'down' | 'neutral' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

/**
 * 상승/하락에 따른 색상 클래스 반환
 * @param value - 값
 * @returns Tailwind CSS 색상 클래스
 */
export function getChangeColorClass(value: number): string {
  const direction = getChangeDirection(value);
  switch (direction) {
    case 'up':
      return 'text-green-500';
    case 'down':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * 상승/하락에 따른 배경 색상 클래스 반환
 * @param value - 값
 * @returns Tailwind CSS 배경 색상 클래스
 */
export function getChangeBgClass(value: number): string {
  const direction = getChangeDirection(value);
  switch (direction) {
    case 'up':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'down':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
}
