// About.tsx
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About the Project
          </h1>
          <div className="h-1 w-24 bg-[#6366f1] rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-3xl">
            Visualizing Revenue Streams, Viewership Trends, and Financial
            Sustainability in the Esports Industry
          </p>
        </div>

        {/* Introduction section */}
        <section className="mb-16 animate-fade-in [animation-delay:200ms]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#6366f1]" />
            Introduction
          </h2>
          <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
            <p className="text-gray-300 leading-relaxed mb-4">
              Esports has rapidly evolved from a niche hobby into a
              multi-billion dollar industry, drawing millions of viewers and
              high-profile sponsorships. Major tournaments such as The
              International (Dota 2) and League of Legends World Championship
              now rival traditional sports in global audience reach. Streaming
              platforms like Twitch and Youtube have further fueled this growth,
              creating a vibrant ecosystem of professional players, content
              creators and communities.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This project dives into four key dimensions critical to
              understanding Esports' revenue streams, viewership trends and
              subsequently, financial sustainability. First, a breakdown of
              revenue streams is provided, which highlights how income is
              generated across tournaments, and platforms. Next, we examine the
              industry's reliance on sponsorships, which might leave it
              vulnerable to market shifts and raises concerns about long-term
              financial stability.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our analysis of prize pool distribution uncovers stark disparities
              - while top-tier tournaments and more popular games dominate
              funding, smaller events and obscure games struggle to stay afloat,
              exposing structural inequalities. Finally, we explore viewership
              trends, identifying emerging titles and formats that could shape
              the future of competitive gaming.
            </p>
          </div>
        </section>

        {/* Motivation section */}
        <section className="mb-16 animate-fade-in [animation-delay:300ms]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#6366f1]" />
            Motivation
          </h2>
          <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
            <p className="text-gray-300 leading-relaxed mb-4">
              As the Esports industry increases in size and influence, its
              financial structure remains uneven and opaque. While the headlines
              boast billion-dollar valuations and skyrocketing viewership, the
              sources and sustainability of this growth deserve closer scrutiny.
              One of the most striking findings from our data is the
              disproportionate reliance on sponsorships. In 2022 alone,
              sponsorships made up over 60% of the industry's total revenue.
              This overwhelming dependence on brand support leaves the ecosystem
              vulnerable to shifts in marketing budgets and economic downturns.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Another critical issue lies in how tournament prize pools are
              distributed. Although a few high-profile events, like Dota 2's The
              International, offer massive rewards, most smaller tournaments
              receive only a fraction of the industry's earnings. This imbalance
              makes it difficult for lesser-known teams and emerging titles to
              compete, limiting diversity and innovation in the space.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Despite these challenges, there is currently no centralized,
              interactive dashboard that unifies financial and viewership data
              across the Esports ecosystem. Most existing analyses remain
              fragmented, making it difficult for stakeholders to make
              strategic, data-driven decisions. Our dashboard bridges this gap
              by consolidating key insights on revenue streams, sponsorship
              dependencies, prize pool distribution, and viewership trends.
            </p>
          </div>
        </section>

        {/* Team section */}
        <section className="mb-16 animate-fade-in [animation-delay:400ms]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#6366f1]" />
            Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Daryl Teo Jun Wei",
                email: "daryl.teo.2021@scis.smu.edu.sg",
              },
              {
                name: "Francis Gabriel Manalo Valdez",
                email: "fvaldez.2021@scis.smu.edu.sg",
              },
              {
                name: "Kenneth Lim Hu Gui",
                email: "kenneth.lim.2021@scis.smu.edu.sg",
              },
              {
                name: "Toh Xin Hong Eugene",
                email: "eugenetoh.2021@economics.smu.edu.sg",
              },
              {
                name: "Zacchaeus Go Jie Ern",
                email: "zacchaeusgo.2021@economics.smu.edu.sg",
              },
            ].map((member) => (
              <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20 hover:border-[#6366f1]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#1c2133] p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                </div>
                <p className="text-sm text-gray-400 break-all">
                  {member.email}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools section */}
        <section className="animate-fade-in [animation-delay:500ms]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#6366f1]" />
            Tools & Technologies
          </h2>
          <div className="bg-[#131825] rounded-lg p-6 border border-gray-800/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-3">
                  React with Vite & TypeScript
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We chose React as our front-end framework for its
                  component-based architecture and ability to build dynamic,
                  single-page applications. Vite accelerates our development
                  workflow with fast hot module reloading and optimized
                  bundling. The application is written in TypeScript, which
                  enhances code robustness with static type checking.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">D3.js</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To bring data to life with compelling visuals, our dashboard
                  integrates D3.js within React components. D3.js is key to
                  drawing animated and interactive charts that display insights.
                  Its powerful data binding and transition features allow for
                  smooth animations and informative tooltips, enabling users to
                  intuitively explore trends and patterns.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Tableau</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  In the early stages of design, Tableau served as an essential
                  tool for prototyping and experimentation. We leveraged
                  Tableau's vast array of visualization options to experiment
                  with various chart types and layouts before implementing them
                  with D3.js on our website.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Vercel</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For deployment, we rely on Vercel, a platform built to support
                  modern web applications with ease. Vercel offers streamlined
                  deployment, global content delivery, and automated continuous
                  integration, ensuring that our application remains performant
                  and secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data sources note */}
        <div className="mt-12 bg-[#131825] rounded-lg p-4 border border-gray-800/20 text-sm text-gray-400 animate-fade-in [animation-delay:400ms]">
          <p>
            <strong>Data Sources:</strong> Esports Earnings, Twitch Tracker,
            Statista, Kaggle datasets on tournament earnings and Twitch
            viewership. Last updated: April 2025.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center animate-fade-in [animation-delay:600ms]">
          <Link
            to="/analytics"
            className="inline-flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-3 rounded-lg text-base transition-all duration-300 font-medium"
          >
            Explore Our Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
