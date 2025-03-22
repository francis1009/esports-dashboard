import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Sidebar } from "../../components/Sidebar";
import Overview from "./overview";
import Viewership from "./viewership";
import * as d3 from "d3";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useLocalStorage(
    "activeSection",
    "overview"
  );
  const [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    // Load CSV data once when the Dashboard mounts
    d3.csv("/data/kaggle_Twitch_game_data.csv").then((rawData) => {
      const parsed = rawData.map((d) => ({
        year: +d.Year,
        game: d.Game,
        peakViewers: +d.Peak_viewers,
        hoursStreamed: +d.Hours_streamed,
        hoursWatched: +d.Hours_watched,
        avgViewers: +d.Avg_viewers,
      }));
      setCsvData(parsed);
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
        return <Viewership csvData={csvData} />;
      case "tournament":
        return <Overview />;
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
          <Viewership csvData={csvData} />
          {/* <Tournament /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
