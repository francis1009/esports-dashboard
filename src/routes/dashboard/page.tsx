import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Sidebar } from "../../components/Sidebar";
import Overview from "./overview";
import Viewership from "./viewership";
import PrizePool from "./prizePool";
import * as d3 from "d3";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useLocalStorage(
    "activeSection",
    "overview"
  );
  const [viewershipData, setViewershipData] = useState<any[]>([]);
  const [generalEsportsData, setGeneralEsportsData] = useState<any[]>([]);
  const [historicalEsportsData, setHistoricalEsportsData] = useState<any[]>([]);
  // const [globalRevenueData, setGlobalRevenueData] = useState<any[]>([]);
  // const [revenueData, setRevenueData] = useState<any[]>([]);
  // const [revenueChangeData, setRevenueChangeData] = useState<any[]>([]);

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
        date: +d.Date,
        game: d.Game,
        earnings: +d.Earnings,
      }));
      setHistoricalEsportsData(parsed);
    });
  }, []);

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeSection");
    };
  }, []);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "revenue":
        return <Overview />;
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
        return <Overview />;
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
          <Overview />
          {/* <Revenue /> */}
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
