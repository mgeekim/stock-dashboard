import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import { StockChartContainer } from "@/features/stock";

export const metadata: Metadata = {
  title: "Stock Chart | Dashboard",
  description: "Real-time stock chart with candlestick, line, and area views",
};

export default function StockChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stock Chart" />
      <div className="space-y-6">
        <StockChartContainer
          initialSymbol="AAPL"
          initialPeriod="1y"
          chartType="candlestick"
          showSearch={true}
          showPeriodSelector={true}
          showInfoCard={true}
          showVolume={true}
          showChartTypeToggle={true}
        />
      </div>
    </div>
  );
}
