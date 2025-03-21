import {
  BarChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Trophy,
  Eye,
  BarChart2,
} from "lucide-react";

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

const Overview: React.FC = () => {
  return (
    <>
      {/* Dashboard content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Esports Industry Overview</h2>
          <p className="text-gray-400">
            Comprehensive analytics on revenue streams, viewership trends, and
            prize pool distributions.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              title: "Total Market Value",
              value: "$2.89B",
              change: "+12.4%",
              icon: DollarSign,
              positive: true,
            },
            {
              title: "Global Viewers",
              value: "495M",
              change: "+8.7%",
              icon: Eye,
              positive: true,
            },
            {
              title: "Sponsorship Share",
              value: "60.2%",
              change: "-2.1%",
              icon: PieChart,
              positive: false,
            },
            {
              title: "Prize Pool Growth",
              value: "$384M",
              change: "+15.3%",
              icon: Trophy,
              positive: true,
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="bg-[#131825] rounded-lg p-4 border border-gray-800/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <div
                    className={`text-xs mt-1 ${
                      stat.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change} from last year
                  </div>
                </div>
                <div className="bg-[#1c2133] p-2 rounded-lg">
                  <stat.icon className="h-5 w-5 text-[#6366f1]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

        {/* Secondary charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </main>
    </>
  );
};

export default Overview;
