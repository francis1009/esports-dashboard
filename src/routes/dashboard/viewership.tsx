import { useState, useMemo } from "react";
import * as d3 from "d3";
import GameFilter from "@/components/charts/game-filter";
import PeakViewersChart from "@/components/charts/peak-viewers-chart";
import EngagementLevelsChart from "@/components/charts/engagement-levels-chart";
import YoYGrowthChart from "@/components/charts/yoy-growth-chart";

interface ViewershipData {
  year: number;
  game: string;
  peakViewers: number;
  hoursStreamed: number;
  hoursWatched: number;
  avgViewers: number;
}
interface ViewershipProps {
  csvData: ViewershipData[];
}

const Viewership: React.FC<ViewershipProps> = ({ csvData }) => {
  const [topN, setTopN] = useState(5);

  // Compute shared topGames based on sum of peakViewers
  const topGames = useMemo(() => {
    const totals = d3.rollups(
      csvData,
      (v) => d3.sum(v, (d) => d.peakViewers),
      (d) => d.game
    );
    totals.sort((a, b) => d3.descending(a[1], b[1]));
    return totals.slice(0, topN).map(([game]) => game);
  }, [csvData, topN]);

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Twitch Viewership Trends</h2>
          <p className="text-gray-400">
            Analysis of top games by viewership, engagement, and growth on
            Twitch
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <GameFilter value={topN} onChange={setTopN} />
          <PeakViewersChart
            topNGames={topN}
            data={csvData}
            topGames={topGames}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EngagementLevelsChart
            topNGames={topN}
            data={csvData}
            topGames={topGames}
          />
          <YoYGrowthChart topNGames={topN} data={csvData} topGames={topGames} />
        </div>
      </main>
    </>
  );
};

export default Viewership;
