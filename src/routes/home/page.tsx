import {
  Eye,
  Trophy,
  Users,
  Award,
  ChevronRight,
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <div className="text-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
          {/* Animated left content section */}
          <div className="lg:w-1/2 space-y-6 animate-fade-in [animation-delay:200ms]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
              Dominate the <span className="text-indigo-400">Esports</span>{" "}
              Landscape
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
              Our comprehensive analytics dashboard provides key insights into
              the esports ecosystem — from sponsorships and prize pools to
              audience trends — helping you understand the factors driving
              industry growth and sustainability.
            </p>

            {/* Animated feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              {[
                {
                  icon: BarChart,
                  title: "Sponsorship Analysis",
                  desc: "Explore sponsorship trends and distribution",
                  delay: "100ms",
                },
                {
                  icon: PieChart,
                  title: "Prize Pool Metrics",
                  desc: "Track prize distribution across tournaments",
                  delay: "200ms",
                },
                {
                  icon: LineChart,
                  title: "Audience Engagement",
                  desc: "Visualize viewership patterns over time",
                  delay: "300ms",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-start gap-3 
                           transition-all duration-300 hover:bg-gray-700/50 hover:border-indigo-500/30 
                           animate-slide-up"
                  style={{ animationDelay: feature.delay }}
                >
                  <feature.icon className="h-6 w-6 text-indigo-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Button
                className="group bg-indigo-900 hover:bg-indigo-800 text-white py-6 rounded-md text-lg
                         transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/30"
              >
                <Link to="/dashboard" className="px-3">
                  Explore Dashboard
                </Link>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Animated right video section */}
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative animate-slide-in-right [animation-delay:400ms]">
            <div
              className="rounded-lg overflow-hidden shadow-2xl border border-gray-800/50 relative group
                          transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/20"
            >
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                poster="/vite.svg?height=400&width=600"
              >
                <source src="/esports.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

              <div
                className="absolute bottom-0 left-0 right-0 p-4 transform transition-all duration-300
                            group-hover:translate-y-0 opacity-90 group-hover:opacity-100"
              >
                <div className="flex items-center gap-2 text-indigo-400">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">
                    Championship Victory Moments
                  </span>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  The emotional highs of tournament victories that define
                  esports excellence
                </p>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>Major Tournaments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Championship Teams</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-6 -right-6 bg-gray-900/90 border border-gray-800/50 p-4 rounded-lg 
                          shadow-xl hidden md:block animate-slide-up [animation-delay:600ms]
                          transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-400" />
                <div>
                  <div className="text-sm font-medium">Viewership Analysis</div>
                  <div className="text-xs text-gray-400">
                    Understanding audience engagement patterns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
