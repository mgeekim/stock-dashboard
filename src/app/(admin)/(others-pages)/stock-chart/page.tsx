"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { StockChartContainer } from "@/features/stock";

export default function StockChartPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stock Chart" />
      <div className="space-y-6">
        <StockChartContainer
          initialSymbol="AAPL"
          initialInterval="1d"
          chartType="candlestick"
          showSearch={true}
          showIntervalSelector={true}
          showInfoCard={true}
          showVolume={true}
          showChartTypeToggle={true}
        />
      </div>
    </div>
  );
}
