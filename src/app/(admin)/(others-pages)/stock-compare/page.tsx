import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Metadata } from "next";
import React from "react";
import { StockCompareContainer } from "@/features/stock";

export const metadata: Metadata = {
  title: "Stock Compare | Dashboard",
  description: "Compare multiple stocks side by side with percent or price mode",
};

export default function StockComparePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Stock Compare" />
      <div className="space-y-6">
        <ComponentCard
          title="Stock Comparison"
          desc="Compare up to 10 stocks by percentage change or absolute price"
        >
          <StockCompareContainer
            initialSymbols={["AAPL", "MSFT"]}
            initialPeriod="1y"
            initialCompareMode="percent"
          />
        </ComponentCard>
      </div>
    </div>
  );
}
