import { useState } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Trophy,
  Eye,
  BarChart2,
} from "lucide-react";

// This would be a placeholder for your D3 visualizations
// In a real implementation, you would create separate components for each chart
const ChartPlaceholder = ({
  title,
  description,
  icon: Icon,
  height = "300px",
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  height?: string;
}) => {
  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div
        className="bg-[#0c101a] p-4 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-gray-500 mb-2">
            Interactive D3.js Visualization
          </div>
          <div className="text-xs text-gray-600">Data will be loaded here</div>
        </div>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Esports Analytics
          </h1>
          <div className="h-1 w-24 bg-[#6366f1] rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-3xl">
            Explore interactive visualizations of revenue streams, viewership
            trends, and prize pool distributions in the competitive gaming
            industry.
          </p>
        </div>

        {/* Analytics tabs */}
        <div className="mb-8 animate-fade-in [animation-delay:200ms]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "revenue"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              Revenue Streams
            </button>
            <button
              onClick={() => setActiveTab("viewership")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "viewership"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <Eye className="h-4 w-4" />
              Viewership Trends
            </button>
            <button
              onClick={() => setActiveTab("prize")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "prize"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <Trophy className="h-4 w-4" />
              Prize Pools
            </button>
          </div>
        </div>

        {/* Revenue Streams Section */}
        {activeTab === "revenue" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#6366f1]" />
                Revenue Distribution in Esports
              </h2>
              <p className="text-gray-300 mb-6">
                The Esports industry has grown exponentially, but revenue
                sources remain heavily concentrated. In 2022, over 60% of
                Esports revenue came from sponsorship deals, creating potential
                vulnerabilities in the ecosystem. These visualizations break
                down revenue streams and their evolution over time.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <ChartPlaceholder
                  title="Revenue by Segment (2020-2029)"
                  description="Breakdown of revenue sources including sponsorships, media rights, and merchandise"
                  icon={PieChart}
                />
                <ChartPlaceholder
                  title="Sponsorship Growth Trends"
                  description="Year-over-year changes in sponsorship revenue and market share"
                  icon={TrendingUp}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ChartPlaceholder
                title="Revenue by Game Title"
                description="Distribution across major esports games"
                icon={BarChart}
                height="250px"
              />
              <ChartPlaceholder
                title="Regional Revenue Distribution"
                description="Market share by geographic region"
                icon={PieChart}
                height="250px"
              />
              <ChartPlaceholder
                title="Endemic vs Non-Endemic Sponsors"
                description="Comparison of gaming vs non-gaming brand investments"
                icon={BarChart2}
                height="250px"
              />
            </div>
          </div>
        )}

        {/* Viewership Trends Section */}
        {activeTab === "viewership" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#6366f1]" />
                Viewership Patterns and Engagement
              </h2>
              <p className="text-gray-300 mb-6">
                While millions tune in to watch their favorite streamers and
                tournaments, not all engagement translates into revenue. These
                visualizations explore the relationship between viewership
                metrics and monetization potential across different game genres
                and platforms.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <ChartPlaceholder
                  title="Top Games on Twitch (2016-2023)"
                  description="Viewership trends for the most popular esports titles"
                  icon={LineChart}
                />
                <ChartPlaceholder
                  title="Peak Concurrent Viewers by Tournament"
                  description="Highest viewership numbers for major esports events"
                  icon={TrendingUp}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ChartPlaceholder
                title="Platform Distribution"
                description="Viewership across Twitch, YouTube, and other platforms"
                icon={PieChart}
                height="250px"
              />
              <ChartPlaceholder
                title="Viewership by Game Genre"
                description="Comparison between MOBAs, FPS, Battle Royale, etc."
                icon={BarChart}
                height="250px"
              />
              <ChartPlaceholder
                title="Viewership to Revenue Correlation"
                description="Analysis of how viewership translates to monetization"
                icon={LineChart}
                height="250px"
              />
            </div>
          </div>
        )}

        {/* Prize Pools Section */}
        {activeTab === "prize" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#6366f1]" />
                Prize Pool Distribution and Tournament Economics
              </h2>
              <p className="text-gray-300 mb-6">
                A small number of top tournaments account for the majority of
                Esports prize pools, creating significant financial disparities
                in the competitive ecosystem. These visualizations examine prize
                money distribution across games, tournaments, and regions.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <ChartPlaceholder
                  title="Leading Tournaments by Prize Pool (2024)"
                  description="Ranking of the highest-paying esports competitions"
                  icon={BarChart}
                />
                <ChartPlaceholder
                  title="Prize Pool Growth Over Time"
                  description="Historical trends in tournament prize money"
                  icon={LineChart}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ChartPlaceholder
                title="Prize Distribution by Game"
                description="How prize money is allocated across different titles"
                icon={PieChart}
                height="250px"
              />
              <ChartPlaceholder
                title="Top-Heavy Prize Structures"
                description="Analysis of winner-take-all vs distributed prize models"
                icon={BarChart2}
                height="250px"
              />
              <ChartPlaceholder
                title="Player Earnings Inequality"
                description="Distribution of earnings among professional players"
                icon={LineChart}
                height="250px"
              />
            </div>
          </div>
        )}

        {/* Data sources note */}
        <div className="mt-12 bg-[#131825] rounded-lg p-4 border border-gray-800/20 text-sm text-gray-400 animate-fade-in [animation-delay:400ms]">
          <p>
            <strong>Data Sources:</strong> Esports Earnings, Twitch Tracker,
            Statista, and other public datasets. Last updated: March 2025.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
