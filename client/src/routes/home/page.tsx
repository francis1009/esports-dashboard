import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, LineChart, HandCoins, Eye } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white/10 rounded-lg p-6 backdrop-filter backdrop-blur-lg">
    <div className="text-red-400 mb-4">{icon}</div>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-300">{description}</p>
  </div>
);

const Home: React.FC = () => {
  return (
    <div className="flex bg-gradient-to-br from-red-800 to-black min-h-screen text-white items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
          The Rise and Challenges of the Esports Industry
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12 max-w-3xl mx-auto">
          Our dashboard unifies key data — from sponsorships and prize pools to
          audience trends — revealing the drivers behind growth and
          sustainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<LineChart className="w-12 h-12" />}
            title="Sponsorship Reliance"
            description="Discover how heavy reliance on sponsorships leaves Esports teams and tournaments vulnerable to market fluctuations, and learn about strategies for long-term stability."
          />
          <FeatureCard
            icon={<HandCoins className="w-12 h-12" />}
            title="Prize Pool Disparities"
            description="Uneven prize pool distribution is a major challenge for smaller tournaments. Explore data that reveals how the largest events command the majority of earnings."
          />
          <FeatureCard
            icon={<Eye className="w-12 h-12" />}
            title="Viewership Patterns"
            description="From casual to competitive, not all viewer engagement translates into revenue. Dive into trends from Twitch and other platforms to understand how audiences shape the Esports landscape."
          />
        </div>

        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out"
          >
            View Dashboard
            <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
