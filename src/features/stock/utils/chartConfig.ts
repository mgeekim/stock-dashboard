import { ApexOptions } from 'apexcharts';
import { DEFAULT_CHART_COLORS, ChartColors } from '../types';

/**
 * Helper function to safely extract yaxis labels from ApexOptions
 * (yaxis can be either a single object or an array)
 */
function getYaxisLabels(yaxis: ApexOptions['yaxis']) {
  if (!yaxis) return undefined;
  if (Array.isArray(yaxis)) {
    return yaxis[0]?.labels;
  }
  return yaxis.labels;
}

/**
 * 기본 차트 옵션
 * @param isDarkMode - 다크모드 여부
 * @returns ApexCharts 기본 옵션
 */
export function getBaseChartOptions(isDarkMode: boolean = false): ApexOptions {
  const textColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  const backgroundColor = isDarkMode ? 'transparent' : 'transparent';

  return {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      background: backgroundColor,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 350,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    grid: {
      show: true,
      borderColor: gridColor,
      strokeDashArray: 0,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: textColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? 'dark' : 'light',
      style: {
        fontSize: '12px',
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  };
}

/**
 * 캔들스틱 차트 옵션
 * @param isDarkMode - 다크모드 여부
 * @param colors - 차트 색상
 * @returns ApexCharts 캔들스틱 옵션
 */
export function getCandlestickOptions(
  isDarkMode: boolean = false,
  colors: ChartColors = DEFAULT_CHART_COLORS
): ApexOptions {
  const baseOptions = getBaseChartOptions(isDarkMode);

  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'candlestick',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: 'zoom',
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: colors.up,
          downward: colors.down,
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: 'datetime',
      labels: {
        ...baseOptions.xaxis?.labels,
        datetimeUTC: false,
        format: 'MM/dd',
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      ...baseOptions.yaxis,
      tooltip: {
        enabled: true,
      },
      labels: {
        ...getYaxisLabels(baseOptions.yaxis),
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const dateStr = date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return `
          <div class="p-2 text-sm">
            <div class="font-medium mb-1">${dateStr}</div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <span class="text-gray-500">시가:</span>
              <span class="font-medium">$${o.toFixed(2)}</span>
              <span class="text-gray-500">고가:</span>
              <span class="font-medium text-green-600">$${h.toFixed(2)}</span>
              <span class="text-gray-500">저가:</span>
              <span class="font-medium text-red-600">$${l.toFixed(2)}</span>
              <span class="text-gray-500">종가:</span>
              <span class="font-medium">$${c.toFixed(2)}</span>
            </div>
          </div>
        `;
      },
    },
  };
}

/**
 * 라인 차트 옵션
 * @param isDarkMode - 다크모드 여부
 * @param colors - 차트 색상
 * @param filled - 영역 채우기 여부
 * @returns ApexCharts 라인 옵션
 */
export function getLineChartOptions(
  isDarkMode: boolean = false,
  colors: ChartColors = DEFAULT_CHART_COLORS,
  filled: boolean = false
): ApexOptions {
  const baseOptions = getBaseChartOptions(isDarkMode);

  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: filled ? 'area' : 'line',
    },
    colors: [colors.line],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: filled
      ? {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [0, 100],
          },
        }
      : {
          type: 'solid',
        },
    markers: {
      size: 0,
      strokeWidth: 2,
      hover: {
        size: 5,
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: 'datetime',
      labels: {
        ...baseOptions.xaxis?.labels,
        datetimeUTC: false,
        format: 'MM/dd',
      },
    },
    yaxis: {
      ...baseOptions.yaxis,
      labels: {
        ...getYaxisLabels(baseOptions.yaxis),
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      x: {
        format: 'yyyy년 MM월 dd일',
      },
      y: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
      },
    },
  };
}

/**
 * 거래량 차트 옵션
 * @param isDarkMode - 다크모드 여부
 * @param colors - 차트 색상
 * @returns ApexCharts 거래량 바 차트 옵션
 */
export function getVolumeChartOptions(
  isDarkMode: boolean = false,
  colors: ChartColors = DEFAULT_CHART_COLORS
): ApexOptions {
  const baseOptions = getBaseChartOptions(isDarkMode);

  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'bar',
      brush: {
        enabled: false,
      },
    },
    colors: [colors.volume],
    plotOptions: {
      bar: {
        columnWidth: '80%',
        borderRadius: 0,
      },
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: 'datetime',
      labels: {
        show: false,
      },
    },
    yaxis: {
      ...baseOptions.yaxis,
      labels: {
        ...getYaxisLabels(baseOptions.yaxis),
        formatter: (value: number) => {
          if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(0)}M`;
          }
          if (value >= 1_000) {
            return `${(value / 1_000).toFixed(0)}K`;
          }
          return value.toString();
        },
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      y: {
        formatter: (value: number) => value.toLocaleString('en-US'),
        title: {
          formatter: () => '거래량:',
        },
      },
    },
  };
}

/**
 * 비교 차트 옵션
 * @param isDarkMode - 다크모드 여부
 * @param seriesColors - 시리즈별 색상 배열
 * @param isPercentMode - 퍼센트 모드 여부
 * @returns ApexCharts 비교 라인 차트 옵션
 */
export function getCompareChartOptions(
  isDarkMode: boolean = false,
  seriesColors: string[],
  isPercentMode: boolean = true
): ApexOptions {
  const baseOptions = getBaseChartOptions(isDarkMode);

  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line',
    },
    colors: seriesColors,
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: {
        size: 8,
        shape: 'circle',
      },
    },
    xaxis: {
      ...baseOptions.xaxis,
      type: 'datetime',
      labels: {
        ...baseOptions.xaxis?.labels,
        datetimeUTC: false,
        format: 'MM/dd',
      },
    },
    yaxis: {
      ...baseOptions.yaxis,
      labels: {
        ...getYaxisLabels(baseOptions.yaxis),
        formatter: (value: number) =>
          isPercentMode
            ? `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
            : `$${value.toFixed(2)}`,
      },
    },
    tooltip: {
      ...baseOptions.tooltip,
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) =>
          isPercentMode
            ? `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
            : `$${value.toFixed(2)}`,
      },
    },
  };
}
