"use client";

import { useState } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Users,
  Trophy,
  Eye,
  ArrowRight,
  BarChart2,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// This would be a placeholder for your D3 visualizations
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

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`bg-[#131825] border-r border-gray-800/20 fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform 
                   ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                   md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800/20">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Trophy className="h-5 w-5 text-[#6366f1]" />
            <span>EsportsInsight</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
              Analytics
            </h3>
            <nav className="space-y-1">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#6366f1]/10 text-[#6366f1] font-medium"
              >
                <BarChart2 className="h-4 w-4" />
                Overview
              </Link>
              <Link
                to="/dashboard/revenue"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <DollarSign className="h-4 w-4" />
                Revenue Analysis
              </Link>
              <Link
                to="/dashboard/viewership"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <Eye className="h-4 w-4" />
                Viewership Trends
              </Link>
              <Link
                to="/dashboard/tournaments"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <Trophy className="h-4 w-4" />
                Tournament Data
              </Link>
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
              Reports
            </h3>
            <nav className="space-y-1">
              <Link
                to="/dashboard/reports/sponsorship"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <PieChart className="h-4 w-4" />
                Sponsorship Report
              </Link>
              <Link
                to="/dashboard/reports/growth"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <TrendingUp className="h-4 w-4" />
                Growth Metrics
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
              Settings
            </h3>
            <nav className="space-y-1">
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#1c2133] hover:text-white"
              >
                <Users className="h-4 w-4" />
                Account
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 md:pl-0 pl-0">
        {/* Top navigation */}
        <header className="bg-[#0a0d14] border-b border-gray-800/20 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-400 hover:text-white md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="flex items-center gap-2 text-sm bg-[#131825] px-3 py-2 rounded-md">
                  <span>Last 30 Days</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <Link to="/" className="text-gray-400 hover:text-white">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Esports Industry Overview
            </h2>
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
              title="Revenue Growth by Segment (2020-2025)"
              description="Breakdown of revenue sources including sponsorships, media rights, and merchandise"
              icon={LineChart}
              height="350px"
            />
            <ChartPlaceholder
              title="Top Tournaments by Prize Pool (2024)"
              description="Ranking of the highest-paying esports competitions worldwide"
              icon={BarChart}
              height="350px"
            />
          </div>

          {/* Secondary charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartPlaceholder
              title="Viewership by Platform"
              description="Distribution across streaming services"
              icon={PieChart}
              height="250px"
            />
            <ChartPlaceholder
              title="Top Games by Viewership"
              description="Most watched competitive titles"
              icon={BarChart2}
              height="250px"
            />
            <ChartPlaceholder
              title="Sponsorship Categories"
              description="Types of brands investing in esports"
              icon={PieChart}
              height="250px"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
