import { useMemo } from "react";
import GlobalRevenueDistributionChart from "@/components/charts/global-revenue-distribution-chart";
import PercentageChangeTable from "@/components/charts/percentage-change-table";
import RevenueByMarketStackedBarChart from "@/components/charts/revenue-by-market-stacked-bar-chart";
import RevenueGrowthScatterPlot from "@/components/charts/revenue-growth-scatterplot";

interface GlobalRevenueData {
  country: string;
  year: number;
  revenue: number;
}

interface RevenueByMarketData {
  actualOrForecast: string;
  market: string;
  year: number;
  revenue: number;
}

interface RevenueChangeData {
  market: string;
  year: number;
  revenueChange: number;
}

interface RevenueProps {
  globalRevenueData: GlobalRevenueData[];
  revenueByMarketData: RevenueByMarketData[];
  revenueChangeData: RevenueChangeData[];
}

const Revenue: React.FC<RevenueProps> = ({
  globalRevenueData,
  revenueByMarketData,
  revenueChangeData,
}) => {
  // Join the three datasets on the `year` field.
  // Only retain records whose year exists in each of the three datasets.
  const joinedData = useMemo(() => {
    const revenueByMarketDataYears = new Set(
      revenueByMarketData.map((d) => d.year)
    );
    const revenueChangeYears = new Set(revenueChangeData.map((d) => d.year));

    // For a year to be kept, it must exist in all three datasets.
    const commonYears = new Set(
      globalRevenueData
        .filter(
          (d) =>
            revenueByMarketDataYears.has(d.year) &&
            revenueChangeYears.has(d.year)
        )
        .map((d) => d.year)
    );

    return {
      globalRevenueData: globalRevenueData.filter((d) =>
        commonYears.has(d.year)
      ),
      revenueByMarketData: revenueByMarketData.filter((d) =>
        commonYears.has(d.year)
      ),
      revenueChangeData: revenueChangeData.filter((d) =>
        commonYears.has(d.year)
      ),
    };
  }, [globalRevenueData, revenueByMarketData, revenueChangeData]);

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Revenue Analysis</h2>
          <p className="text-gray-400">
            Analysis of revenue by global distribution and market, and growth
            rate over time
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <GlobalRevenueDistributionChart
            globalRevenueData={joinedData.globalRevenueData}
          />
          <PercentageChangeTable
            revenueChangeData={joinedData.revenueChangeData}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <RevenueByMarketStackedBarChart
            revenueByMarketData={revenueByMarketData}
            revenueChangeData={revenueChangeData}
          />
          <RevenueGrowthScatterPlot
            revenueByMarketData={revenueByMarketData}
            revenueChangeData={revenueChangeData}
          />
        </div>
      </main>
    </>
  );
};

export default Revenue;
