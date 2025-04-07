// Analytics.tsx
import { useState } from "react";
import {
  BarChart,
  LineChart,
  TrendingUp,
  DollarSign,
  Trophy,
  Eye,
  Percent,
  ArrowRight,
  FileText,
  Lightbulb,
} from "lucide-react";

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState("results");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Esports Analytics: Findings & Insights
          </h1>
          <div className="h-1 w-24 bg-[#6366f1] rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-3xl">
            Exploring the financial dynamics and viewership patterns of the
            Esports industry through data-driven analysis.
          </p>
        </div>

        {/* Analytics tabs */}
        <div className="mb-8 animate-fade-in [animation-delay:200ms]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("results")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "results"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <BarChart className="h-4 w-4" />
              Results & Discussion
            </button>
            <button
              onClick={() => setActiveTab("conclusion")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "conclusion"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Conclusion
            </button>
            <button
              onClick={() => setActiveTab("future")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === "future"
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#131825] text-gray-400 hover:bg-[#1c2133]"
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              Future Work
            </button>
          </div>
        </div>

        {/* Results & Discussion Section */}
        {activeTab === "results" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#6366f1]" />
                Revenue Streams
              </h2>
              <p className="text-gray-300 mb-4">
                Revenue streams vary significantly by region, reflecting
                differences in consumer preferences, infrastructure
                advancements, and regulatory environments. In highly developed
                markets like the United States, the total revenue of the Esports
                industry can reach as high as 11 billion USD. In contrast, less
                developed markets such as parts of South America and Africa find
                themselves hovering in the 100 to 200 million USD mark.
              </p>
              <p className="text-gray-300 mb-4">
                From 2017 till 2024, a very steady increase in total revenue can
                be observed, and this increase is forecasted to continue every
                year until 2029. When breaking down the total revenue into
                different streams, Esports Betting has emerged as the most
                dominant revenue source in recent years and is also forecasted
                to maintain its lead in the years ahead, with Sponsorship &
                Advertising being the second biggest contributor.
              </p>
              <p className="text-gray-300">
                When comparing each segment's average revenue with their average
                growth rate, Esports Betting stands out as having both high
                average revenue and a high growth rate. Other segments, such as
                Streaming, Merchandise & Ticketing, and Media Rights have high
                growth rates despite having a relatively small revenue
                contribution, which might signal potential areas for investment.
              </p>
            </div>

            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Percent className="h-5 w-5 text-[#6366f1]" />
                Sponsorship Dependencies
              </h2>
              <p className="text-gray-300 mb-4">
                Sponsorship & Advertising revenue growth has declined steadily
                year-over-year - from 18.3% in 2018 to just 7.4% projected in
                2025 - highlighting a slowing momentum. This downward trend
                signals market saturation or diminishing returns on brand
                investments in Esports. On the other hand, Esports betting and
                Streaming show consistent double-digit growth from 2018 to 2025.
              </p>
              <p className="text-gray-300 mb-4">
                Despite declining growth, Sponsorships & Advertising remains the
                second top contributor to overall revenue by a significant
                margin. Its absolute value far exceeds other revenue streams bar
                Esports betting, which highlights its critical role in funding
                tournaments, teams and events. This dominance underscores how
                much of the industry's financial structure is tied to support
                from sponsors.
              </p>
              <p className="text-gray-300">
                The proportional share of Sponsorships & Advertising is observed
                to be shrinking gradually over the years even though the
                absolute value is still high. This suggests that while
                sponsorships are still growing in dollars, other revenue streams
                are expanding faster, slowly reshaping the ecosystem. However,
                until these other revenue streams mature, the industry still
                remains exposed to volatility in sponsorship spending.
              </p>
            </div>

            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#6366f1]" />
                Prize Pool Distribution
              </h2>
              <p className="text-gray-300 mb-4">
                Earnings from Esports tournaments are heavily concentrated among
                a few high performing titles and genres. Multiplayer Online
                Battle Arena (MOBA) games consistently offer the highest average
                prize pools of around $95,000 per tournament, followed by Battle
                Royale and First-Person Shooters. This suggests strong financial
                backing and high audience appeal in these competitive games.
              </p>
              <p className="text-gray-300 mb-4">
                Dota 2 stands out as the industry leader generating close to
                $360 million in total earnings, which far surpasses other games.
                Games such as Fortnite, Counter-Strike: Global Offensive and
                League of Legends also rank highly but earnings drop sharply
                beyond these top few games. This highlights an ecosystem where a
                small group of games absorb the majority of tournament fundings.
              </p>
              <p className="text-gray-300">
                When comparing viewership and earnings together, there is an
                increase in both metrics from 2016 to around 2020, reflecting
                growing audience interest and investments. However from 2021
                onwards, both viewership and earnings have declined, with
                viewership peaking earlier and falling faster than earnings.
                This suggests that audience attention is not always aligned with
                prize pool growth, which could possibly point to inefficiencies
                in monetizing viewership.
              </p>
            </div>

            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#6366f1]" />
                Twitch Viewership Trends
              </h2>
              <p className="text-gray-300 mb-4">
                From 2016 to 2021, Twitch experienced significant growth in peak
                viewership across its top games, driven by the rise of popular
                titles such as League of Legends, Fortnite, and Counter-Strike:
                Global Offensive. During this period, peak viewers steadily
                increased, reflecting the platform's growing influence in the
                gaming and streaming ecosystem.
              </p>
              <p className="text-gray-300 mb-4">
                However, starting in 2022, there is a noticeable decline in peak
                viewership across all categories. This drop suggests potential
                market saturation, shifts in audience preferences away from
                traditional gaming content toward newer formats or platforms, or
                post-pandemic engagement drops.
              </p>
              <p className="text-gray-300">
                The scatter plot comparing average hours watched versus hours
                streamed reveals distinct engagement patterns: League of Legends
                balances high hours streamed with substantial viewer engagement,
                reflecting its established fan base and competitive scene. In
                contrast, Counter-Strike: Global Offensive displays lower
                average viewership relative to hours streamed, suggesting
                challenges in sustaining audience interest.
              </p>
            </div>
          </div>
        )}

        {/* Conclusion Section */}
        {activeTab === "conclusion" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#6366f1]" />
                Key Findings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Regional Revenue Disparities
                  </h3>
                  <p className="text-gray-300">
                    Revenue generation in the Esports industry is highly
                    dependent on regional development and market maturity.
                    Developed regions such as the United States and China
                    contribute the highest revenue, driven by infrastructure
                    readiness and consumer demand, while emerging markets still
                    lag in volume despite growing interest.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Sponsorship Dependency Concerns
                  </h3>
                  <p className="text-gray-300">
                    The industry's heavy reliance on Sponsorship & Advertising
                    poses a significant sustainability concern. While this
                    segment continues to be a major revenue contributor, its
                    year-over-year growth has been steadily declining,
                    indicating signs of market saturation. The decreasing
                    proportional share of sponsorships points to a gradual shift
                    in the industry's revenue structure, as faster-growing
                    segments like Esports Betting and Streaming gain momentum.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Prize Pool Concentration
                  </h3>
                  <p className="text-gray-300">
                    Prize pool distribution in Esports reveals a significant
                    concentration of earnings among a few dominant titles and
                    genres, such as Dota 2, Fortnite, and League of Legends.
                    This heavy reliance on high-performing MOBA and Battle
                    Royale games exposes the industry to volatility, as any
                    decline in popularity or sponsorship for these titles could
                    greatly disrupt tournament funding.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Shifting Viewership Patterns
                  </h3>
                  <p className="text-gray-300">
                    Twitch viewership trends indicate a dynamic and rapidly
                    shifting content landscape. While the platform saw steady
                    growth in peak viewership between 2016 and 2021, a decline
                    post-2022 suggests that audience preferences are evolving,
                    possibly due to market saturation or post-pandemic
                    behavioral shifts. Established titles like League of Legends
                    have maintained strong engagement, while others like
                    Fortnite show signs of stagnation after initial explosive
                    growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#6366f1]" />
                Industry Outlook
              </h2>
              <p className="text-gray-300 mb-4">
                Our analysis suggests that the Esports industry is entering a
                more mature phase, where explosive growth of the earlier years
                is giving way to more tempered expansion. This trend emphasizes
                the importance of innovation and diversification in revenue
                strategies to sustain long-term growth and resilience in an
                increasingly competitive landscape.
              </p>
              <p className="text-gray-300">
                While the industry continues to grow, stakeholders should be
                cautious of overdependence on sponsorships and take strategic
                steps to diversify revenue streams to ensure long-term financial
                resilience. Expanding tournament investments into
                underrepresented categories may enhance industry resilience and
                foster a more inclusive competitive landscape.
              </p>
            </div>
          </div>
        )}

        {/* Future Work Section */}
        {activeTab === "future" && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#6366f1]" />
                Limitations & Future Work
              </h2>
              <p className="text-gray-300 mb-6">
                While the findings presented offer valuable insights into the
                Esports industry, there are several limitations to consider and
                opportunities for future research.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Data Limitations
                  </h3>
                  <p className="text-gray-300">
                    Much of the analysis relies on static datasets, which
                    capture a snapshot in time but may not reflect ongoing
                    changes in the rapidly evolving Esports industry. For
                    instance, emerging titles, newly introduced revenue streams,
                    and recent market shifts may not be fully represented.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Enhanced Data Collection
                  </h3>
                  <p className="text-gray-300">
                    To strengthen future analysis, incorporating dynamic
                    datasets that update in real-time or at regular intervals
                    would offer a more accurate and timely picture of industry
                    developments. Data on player demographics, engagement rates,
                    sponsorship performance metrics, and regional digital
                    infrastructure could also provide a more holistic view.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Expanded Visualization Capabilities
                  </h3>
                  <p className="text-gray-300">
                    Future iterations of this dashboard could incorporate more
                    advanced interactive features, allowing users to perform
                    custom queries, create personalized visualizations, and
                    export data for further analysis. Integration with live data
                    feeds from tournaments and streaming platforms would enhance
                    the real-time value of the insights.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#6366f1]" />
                    Predictive Analytics
                  </h3>
                  <p className="text-gray-300">
                    Building on the current descriptive analytics, future work
                    could incorporate predictive models to forecast viewership
                    trends, revenue growth, and emerging game popularity. This
                    would provide stakeholders with forward-looking insights to
                    inform strategic planning and investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
