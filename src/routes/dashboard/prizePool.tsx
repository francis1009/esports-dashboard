import { useState, useMemo } from "react";
import * as d3 from "d3";
import GenreFilter from "@/components/charts/genre-filter";
import AvgPrizePoolChart from "@/components/charts/avg-prize-pool-chart";
import TopGamesByEarningsChart from "@/components/charts/top-games-by-earnings-chart";
import ViewershipVsEarningsChart from "@/components/charts/viewership-vs-earnings-chart";
import GenreMonetizationChart from "@/components/charts/genre-monetization-chart";

interface ViewershipData {
  year: number;
  game: string;
  peakViewers: number;
  hoursStreamed: number;
  hoursWatched: number;
  avgViewers: number;
}

interface GeneralEsportsData {
  game: string;
  genre: string;
  totalEarnings: number;
  totalTournaments: number;
}

interface HistoricalEsportsData {
  game: string;
  earnings: number;
}

interface PrizePoolProps {
  viewershipData: ViewershipData[];
  generalEsportsData: GeneralEsportsData[];
  historicalEsportsData: HistoricalEsportsData[];
}

const PrizePool: React.FC<PrizePoolProps> = ({
  viewershipData,
  generalEsportsData,
  historicalEsportsData,
}) => {
  const [topN, setTopN] = useState(5);

  // Join the three datasets on the `game` field.
  // Only retain records whose game exists in each of the three datasets.
  const joinedData = useMemo(() => {
    const viewershipGames = new Set(viewershipData.map((d) => d.game));
    const historicalGames = new Set(historicalEsportsData.map((d) => d.game));

    // For a game to be kept, it must exist in all three datasets.
    const commonGames = new Set(
      generalEsportsData
        .filter(
          (d) => viewershipGames.has(d.game) && historicalGames.has(d.game)
        )
        .map((d) => d.game)
    );

    return {
      viewershipData: viewershipData.filter((d) => commonGames.has(d.game)),
      generalEsportsData: generalEsportsData.filter((d) =>
        commonGames.has(d.game)
      ),
      historicalEsportsData: historicalEsportsData.filter((d) =>
        commonGames.has(d.game)
      ),
    };
  }, [viewershipData, generalEsportsData, historicalEsportsData]);

  // Compute shared topGenres based on average totalEarnings using the joined data.
  const topGenres = useMemo(() => {
    const totals = d3.rollups(
      joinedData.generalEsportsData,
      (v) => d3.mean(v, (d) => d.totalEarnings),
      (d) => d.genre
    );
    totals.sort((a, b) => d3.descending(a[1], b[1]));
    return totals.slice(0, topN).map(([genre]) => genre);
  }, [joinedData.generalEsportsData, topN]);

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Esports Prize Pool Analysis
          </h2>
          <p className="text-gray-400">
            Analysis of Esports tournament prize pool by genre, viewership, and
            monetization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GenreFilter value={topN} onChange={setTopN} />
          <AvgPrizePoolChart
            data={joinedData.generalEsportsData}
            topGenres={topGenres}
          />
          <TopGamesByEarningsChart
            historicalData={joinedData.historicalEsportsData}
            generalData={joinedData.generalEsportsData}
            topGenres={topGenres}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ViewershipVsEarningsChart
            viewershipData={joinedData.viewershipData}
            generalEsportsData={joinedData.generalEsportsData}
            topGenres={topGenres}
          />
          <GenreMonetizationChart
            viewershipData={joinedData.viewershipData}
            generalEsportsData={joinedData.generalEsportsData}
            topGenres={topGenres}
          />
        </div>
      </main>
    </>
  );
};

export default PrizePool;
