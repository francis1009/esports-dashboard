import { useState } from "react";
import GameFilter from "@/components/charts/game-filter";
import PeakViewersChart from "@/components/charts/peak-viewers-chart";

const Viewership: React.FC = () => {
  const [topN, setTopN] = useState(5);

  return (
    <>
      {/* Dashboard content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Twitch Viewership Trends</h2>
          <p className="text-gray-400">
            Analysis of top games by viewership, engagement, and growth on
            Twitch
          </p>
        </div>

        {/* Filter */}

        {/* Main charts */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <GameFilter value={topN} onChange={setTopN}></GameFilter>
          <PeakViewersChart topNGames={topN} />
        </div>

        {/* Secondary charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
      </main>
    </>
  );
};

export default Viewership;
