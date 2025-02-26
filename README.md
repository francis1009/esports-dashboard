# Esports Dashboard Webpage

## Description
Esports has rapidly evolved from a niche hobby into a multi-billion dollar industry, attracting millions of viewers and high-profile sponsors. Competitive gaming now rivals traditional sports in terms of audience size, with major tournaments such as The International (Dota 2) and League of Legends World Championship drawing millions of live viewers. Streaming platforms like Twitch and Youtube have further fueled this growth, creating a vibrant ecosystem of professional players, content creators and communities.

Despite the rapid expansion, the Esports industry remains misunderstood, particularly when it comes to financial sustainability. Unlike in traditional sports where ticket sales, media rights and merchandise drive revenue, Esports teams and tournaments rely heavily on sponsorships. Additionally, revenue distribution is highly uneven, with a handful of major tournaments and game titles commanding the majority of earnings while smaller competitions struggle for financial stability.

Another challenge is the difference between casual and competitive viewership. While millions tune in to watch their favourite streamers and tournaments, not all engagement translates into revenue. Some game genres, like battle royale titles, attract massive audiences but lack structured monetization models compared to Multiplayer Online Battle Arenas (MOBAS) and First-Person Shooters (FPS) with established competitive leagues. This discrepancy highlights the need for a deeper analysis of how Esports organizations generate revenue and where the industry’s future growth lies.

The project aims to explore these complexities by visualizing key industry trends using primarily Tableau. By analyzing revenue streams, viewership patterns and financial data from major tournaments, we seek to provide insights into the real drivers of Esports growth and the challenges it faces. Understanding these dynamics is crucial for investors, game developers and organizations looking to navigate this rapidly evolving industry.

## Installation & Run

### Frontend React
Open Terminal & Run the following commands:
1. cd client
2. npm install
3. create a .env file in esports-dashboard/client/ directory containing the address and port number of the backend server\
In the following format:
```
REACT_APP_API_URL="http://localhost:5000"
```
4. npm run dev

### Backend Flask
Open Terminal & Run the following commands:
1. cd server
2. create a .env file in esports-dashboard/server/ directory containing the necessary APIs (Request me for the .env file)
3. python app.py

You should be directed to a webpage upon completing the above instructions.