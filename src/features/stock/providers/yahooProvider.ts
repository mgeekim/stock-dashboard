import {
  StockQuote,
  HistoricalDataPoint,
  TickInterval,
  SearchResult,
  INTERVAL_CONFIG,
} from '../types';
import { StockDataProvider, ProviderError } from './index';

/**
 * Yahoo Finance 인스턴스 생성 헬퍼
 */
async function getYahooFinance() {
  const { default: YahooFinance } = await import('yahoo-finance2');
  return new YahooFinance();
}

/**
 * Yahoo Finance Provider
 * yahoo-finance2 라이브러리를 사용하여 미국 주식 데이터 제공
 */
export class YahooProvider implements StockDataProvider {
  readonly name = 'Yahoo Finance';
  readonly market = 'US' as const;

  /**
   * 현재 시세 조회
   */
  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const yahooFinance = await getYahooFinance();

      const quote = await yahooFinance.quote(symbol);

      if (!quote) {
        throw new ProviderError(
          `종목을 찾을 수 없습니다: ${symbol}`,
          this.name,
          'NOT_FOUND'
        );
      }

      return {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        previousClose: quote.regularMarketPreviousClose || 0,
        open: quote.regularMarketOpen || 0,
        dayHigh: quote.regularMarketDayHigh || 0,
        dayLow: quote.regularMarketDayLow || 0,
        volume: quote.regularMarketVolume || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
        marketCap: quote.marketCap || 0,
        exchange: quote.exchange,
        currency: quote.currency,
      };
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }
      throw new ProviderError(
        `시세 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        this.name
      );
    }
  }

  /**
   * 과거 데이터 조회
   */
  async getHistorical(
    symbol: string,
    interval: TickInterval = '1d'
  ): Promise<HistoricalDataPoint[]> {
    try {
      const yahooFinance = await getYahooFinance();

      const config = INTERVAL_CONFIG[interval];
      const period1 = new Date();
      period1.setDate(period1.getDate() - config.defaultDays);
      const period2 = new Date();

      // v3 API uses chart() method instead of historical()
      const result = await yahooFinance.chart(symbol, {
        period1: period1.toISOString().split('T')[0],
        period2: period2.toISOString().split('T')[0],
        interval: config.yahooInterval,
      });

      if (!result || !result.quotes || result.quotes.length === 0) {
        return [];
      }

      return result.quotes
        .filter((item: { date: Date | null }) => item.date !== null)
        .map((item: { date: Date; open: number; high: number; low: number; close: number; volume: number }) => ({
          date: item.date.toISOString().split('T')[0],
          timestamp: Math.floor(item.date.getTime() / 1000),
          open: item.open || 0,
          high: item.high || 0,
          low: item.low || 0,
          close: item.close || 0,
          volume: item.volume || 0,
        }));
    } catch (error) {
      throw new ProviderError(
        `과거 데이터 조회 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        this.name
      );
    }
  }

  /**
   * 종목 검색
   */
  async search(query: string): Promise<SearchResult[]> {
    try {
      const yahooFinance = await getYahooFinance();

      const results = await yahooFinance.search(query, {
        quotesCount: 10,
        newsCount: 0,
      });

      if (!results.quotes || results.quotes.length === 0) {
        return [];
      }

      return results.quotes
        .filter((item) => item.symbol && item.quoteType)
        .map((item) => ({
          symbol: item.symbol,
          name: item.longname || item.shortname || item.symbol,
          exchange: item.exchange || '',
          type: this.mapQuoteType(item.quoteType),
        }));
    } catch (error) {
      throw new ProviderError(
        `검색 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
        this.name
      );
    }
  }

  /**
   * Yahoo Finance quote type을 앱 타입으로 변환
   */
  private mapQuoteType(quoteType: string): SearchResult['type'] {
    const mapping: Record<string, SearchResult['type']> = {
      EQUITY: 'stock',
      ETF: 'etf',
      INDEX: 'index',
      MUTUALFUND: 'fund',
    };
    return mapping[quoteType] || 'stock';
  }
}
