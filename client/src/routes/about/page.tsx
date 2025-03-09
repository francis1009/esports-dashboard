import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
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
            Exploring the financial dynamics and growth patterns of the
            competitive gaming industry through interactive data visualizations.
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
              multi-billion dollar industry, attracting millions of viewers and
              high-profile sponsors. Competitive gaming now rivals traditional
              sports in terms of audience size, with major tournaments such as
              The International (Dota 2) and League of Legends World
              Championship drawing millions of live viewers.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Despite the rapid expansion, the Esports industry remains
              misunderstood, particularly when it comes to financial
              sustainability. Unlike in traditional sports where ticket sales,
              media rights and merchandise drive revenue, Esports teams and
              tournaments rely heavily on sponsorships. Additionally, revenue
              distribution is highly uneven, with a handful of major tournaments
              and game titles commanding the majority of earnings while smaller
              competitions struggle for financial stability.
            </p>
            <p className="text-gray-300 leading-relaxed">
              This project aims to explore these complexities by visualizing key
              industry trends using interactive data visualizations. By
              analyzing revenue streams, viewership patterns and financial data
              from major tournaments, we seek to provide insights into the real
              drivers of Esports growth and the challenges it faces.
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
              The Esports industry has grown exponentially, from a $1.64 billion
              market in 2022 to a projected $2.89 billion by 2025. However, in
              2022, over 60% of Esports revenue - approximately $800 million -
              came from sponsorship deals with endemic and non-endemic brands.
              This heavy dependence leaves the industry vulnerable to
              fluctuations in sponsor support, raising concerns about long-term
              financial stability.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Another major challenge is the uneven distribution of revenue. A
              small number of top tournaments account for the majority of
              Esports prize pools, leaving smaller competitions and teams
              financially strained. Despite increasing industry revenues, many
              Esports organizations struggle to remain profitable due to high
              player salaries, operational costs, and inconsistent prize money
              distribution.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Despite these financial complexities, there is currently no
              centralized platform that consolidates key Esports financial data,
              revenue sources, and viewership trends into an accessible and
              interactive format. Our project addresses this gap with an
              interactive Esports analytics dashboard that visualizes revenue
              streams, sponsorship dependencies, prize pool distribution, and
              viewership trends.
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
                id: "01421328",
                email: "daryl.teo.2021@scis.smu.edu.sg",
              },
              {
                name: "Francis Gabriel Manalo Valdez",
                id: "01388777",
                email: "fvaldez.2021@scis.smu.edu.sg",
              },
              {
                name: "Kenneth Lim Hu Gui",
                id: "01397812",
                email: "kenneth.lim.2021@scis.smu.edu.sg",
              },
              {
                name: "Toh Xin Hong Eugene",
                id: "01395931",
                email: "eugenetoh.2021@economics.smu.edu.sg",
              },
              {
                name: "Zacchaeus Go Jie Ern",
                id: "01399192",
                email: "zacchaeusgo.2021@economics.smu.edu.sg",
              },
            ].map((member) => (
              <div
                key={member.id}
                className="bg-[#131825] rounded-lg p-6 border border-gray-800/20 hover:border-[#6366f1]/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#1c2133] p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-[#6366f1]" />
                  </div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-1">ID: {member.id}</p>
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
                <h3 className="text-xl font-medium mb-3">Python</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Python serves as the backbone for our backend data processing
                  and integration, using libraries such as requests, Pandas, and
                  NumPy for data operations. Flask creates lightweight RESTful
                  endpoints for seamless frontend data requests.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">React and D3.js</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our dashboard's interactive user interface is built using
                  React, with D3.js integrated within React components to
                  produce real-time, interactive visualizations for exploring
                  insights on revenue streams, sponsorship dependencies, and
                  viewership patterns.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">Tableau</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Tableau is employed for constructing static, high-level
                  dashboards that offer historical context and trend analysis,
                  complementing our React/D3.js frontend with in-depth
                  visualizations of prize pool distributions, sponsorship
                  impact, and viewership trends.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-3">
                  APIs & Data Sources
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We incorporate several key APIs including Twitch API, YouTube
                  API, Kaggle API, and public data sources from platforms such
                  as Statista to ensure our visualizations are powered by
                  accurate and current data.
                </p>
              </div>
            </div>
          </div>
        </section>

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
}
