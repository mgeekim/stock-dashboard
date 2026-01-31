// ===================
// Types
// ===================
export type {
  StockQuote,
  HistoricalDataPoint,
  PeriodOption,
  CustomPeriod,
  PeriodConfig,
  StockData,
  FetchState,
  CompareDataPoint,
  StockCompareData,
  SearchResult,
  ChartType,
  ChartColors,
} from "./types";

export { PERIOD_CONFIG, DEFAULT_CHART_COLORS, COMPARE_COLORS } from "./types";

// ===================
// Hooks
// ===================
export { useStockData } from "./hooks/useStockData";
export type { UseStockDataOptions, UseStockDataReturn } from "./hooks/useStockData";

export { useStockCompare } from "./hooks/useStockCompare";
export type { UseStockCompareOptions, UseStockCompareReturn } from "./hooks/useStockCompare";

// ===================
// Components - Charts
// ===================
export { BaseStockChart } from "./components/charts/BaseStockChart";
export { CandlestickChart } from "./components/charts/CandlestickChart";
export { StockLineChart } from "./components/charts/StockLineChart";

// ===================
// Components - Compare
// ===================
export { StockCompareChart } from "./components/compare/StockCompareChart";
export { SymbolPicker } from "./components/compare/SymbolPicker";
export { CompareLegend } from "./components/compare/CompareLegend";
export { StockCompareContainer } from "./components/compare/StockCompareContainer";

// ===================
// Components - Widgets
// ===================
export { StockInfoCard } from "./components/widgets/StockInfoCard";
export { PeriodSelector } from "./components/widgets/PeriodSelector";
export { DateRangePicker } from "./components/widgets/DateRangePicker";
export { StockSearchInput } from "./components/widgets/StockSearchInput";

// ===================
// Components - Containers
// ===================
export { StockChartContainer } from "./components/containers/StockChartContainer";
export { MiniStockChart } from "./components/containers/MiniStockChart";

// ===================
// Utils
// ===================
export {
  formatPrice,
  formatNumber,
  formatVolume,
  formatMarketCap,
  formatPercent,
  formatChange,
  formatDate,
  timestampToDate,
  getChangeDirection,
  getChangeColorClass,
  getChangeBgClass,
} from "./utils/formatters";

export {
  getBaseChartOptions,
  getCandlestickOptions,
  getLineChartOptions,
  getVolumeChartOptions,
  getCompareChartOptions,
} from "./utils/chartConfig";
