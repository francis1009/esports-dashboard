import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Sidebar } from "../../components/Sidebar";
import Revenue from "./revenue";
import Viewership from "./viewership";
import PrizePool from "./prizePool";
import * as d3 from "d3";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useLocalStorage(
    "activeSection",
    "revenue"
  );
  const [viewershipData, setViewershipData] = useState<any[]>([]);
  const [generalEsportsData, setGeneralEsportsData] = useState<any[]>([]);
  const [historicalEsportsData, setHistoricalEsportsData] = useState<any[]>([]);
  const [globalRevenueData, setGlobalRevenueData] = useState<any[]>([]);
  const [revenueByMarketData, setRevenueByMarketData] = useState<any[]>([]);
  const [revenueChangeData, setRevenueChangeData] = useState<any[]>([]);

  useEffect(() => {
    // Load CSV data once when the Dashboard mounts
    d3.csv("/data/TwitchGameData.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        year: +d.Year,
        game: d.Game,
        peakViewers: +d.Peak_viewers,
        hoursStreamed: +d.Hours_streamed,
        hoursWatched: +d.Hours_watched,
        avgViewers: +d.Avg_viewers,
      }));
      setViewershipData(parsed);
    });

    d3.csv("/data/GeneralEsportData.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        game: d.Game,
        genre: d.Genre,
        totalEarnings: +d.Total_Earnings,
        totalTournaments: +d.Total_Tournaments,
      }));
      setGeneralEsportsData(parsed);
    });

    d3.csv("/data/HistoricalEsportData.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        game: d.Game,
        earnings: +d.Earnings,
      }));
      setHistoricalEsportsData(parsed);
    });

    d3.csv("/data/GlobalRevenueUSDComparison.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        country: d.Country,
        year: +d.Year,
        revenue: +d.Revenue_USD,
      }));
      setGlobalRevenueData(parsed);
    });

    d3.csv("/data/RevenueByMarketUSD.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        actualOrForecast: d.Actual_or_Forecast,
        market: d.Market_Revenue_by_Market_USD,
        year: new Date(d.Year_Revenue_by_Market_USD).getFullYear(),
        revenue: +d.Revenue,
      }));
      setRevenueByMarketData(parsed);
    });

    d3.csv("/data/RevenuePercentChangeByMarket.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        market: d.Market_Revenue_PC_Change_by_Market,
        year: new Date(d.Year_Revenue_PC_Change_by_Market).getFullYear(),
        revenueChange: +d.Percentage_Change,
      }));
      setRevenueChangeData(parsed);
    });
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeSection");
    };
  }, []);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "revenue":
        return (
          <Revenue
            globalRevenueData={globalRevenueData}
            revenueByMarketData={revenueByMarketData}
            revenueChangeData={revenueChangeData}
          />
        );
      case "viewership":
        return <Viewership gameData={viewershipData} />;
      case "prizePool":
        return (
          <PrizePool
            viewershipData={viewershipData}
            generalEsportsData={generalEsportsData}
            historicalEsportsData={historicalEsportsData}
          />
        );
      default:
        return (
          <Revenue
            globalRevenueData={globalRevenueData}
            revenueByMarketData={revenueByMarketData}
            revenueChangeData={revenueChangeData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main content container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop view */}
        <div className="hidden md:block">{renderActiveComponent()}</div>

        {/* Mobile view */}
        <div className="block md:hidden space-y-8">
          <Revenue
            globalRevenueData={globalRevenueData}
            revenueByMarketData={revenueByMarketData}
            revenueChangeData={revenueChangeData}
          />
          <Viewership gameData={viewershipData} />
          <PrizePool
            viewershipData={viewershipData}
            generalEsportsData={generalEsportsData}
            historicalEsportsData={historicalEsportsData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
