import { useEffect, useRef } from "react";
import { ChartColumnDecreasing } from "lucide-react";
import * as d3 from "d3";

interface GeneralEsportsData {
  genre: string;
  totalEarnings: number;
  totalTournaments: number;
}

interface AvgPrizePoolChartProps {
  data: GeneralEsportsData[];
  topGenres: string[];
}

function truncateLabel(name: string, maxLen = 25) {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export default function AvgPrizePoolChart({
  data,
  topGenres,
}: AvgPrizePoolChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0 || topGenres.length === 0) {
      console.warn(
        "AvgPrizePoolChart: Missing chart element or data/topGenres."
      );
      return;
    }

    // 1) Filter data to only include rows for genres in topGenres
    const filtered = data.filter((d) => topGenres.includes(d.genre));

    // 2) Calculate average prize pool by genre and store total tournaments
    const genreData = d3.rollups(
      filtered,
      (group) => {
        const totalEarnings = d3.sum(group, (d) => d.totalEarnings);
        const totalTournaments = d3.sum(group, (d) => d.totalTournaments);
        return {
          avgPrizePool:
            totalTournaments > 0 ? totalEarnings / totalTournaments : 0,
          totalTournaments: totalTournaments,
        };
      },
      (d) => d.genre
    );

    // Sort by average prize pool in descending order
    genreData.sort((a, b) =>
      d3.descending(a[1].avgPrizePool, b[1].avgPrizePool)
    );

    // 3) Dimensions
    const margin = { top: 40, right: 40, bottom: 100, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create or select persistent SVG container groups
    let svg = d3
      .select(chartRef.current)
      .select("g.chart-content") as d3.Selection<any, unknown, null, undefined>;

    if (svg.empty()) {
      svg = d3
        .select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create persistent groups for axes and bars
      svg.append("g").attr("class", "x-axis");
      svg.append("g").attr("class", "y-axis");
      svg.append("g").attr("class", "bars-group");

      // Add y-axis label
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .style("fill", "#999")
        .style("font-size", "12px");
    } else {
      // Update svg dimensions if necessary
      d3.select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    }

    // 4) Scales
    const xScale = d3
      .scaleBand()
      .domain(genreData.map((d) => d[0]))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(genreData, (d) => d[1].avgPrizePool) || 0])
      .range([height, 0])
      .nice();

    // 5) Color scale based on genre
    const colorScale = d3.scaleOrdinal<string>().domain(topGenres).range([
      "#3182bd", // Battle Royale
      "#6baed6", // Sports
      "#9ecae1", // Multiplayer Online
      "#c6dbef", // Role-Playing Game
      "#e6550d", // Racing
      "#fd8d3c", // Collectible Card Game
      "#fdae6b", // First-Person Shooter
      "#fdd0a2", // Strategy
      "#31a354", // Third-Person Shooter
      "#74c476", // Music/Rhythm Game
      "#a1d99b", // Fighting Game
      "#c7e9c0", // Puzzle Game
    ]);

    // 6) Update axes
    const xAxisCall = d3
      .axisBottom(xScale)
      .tickFormat((d) => truncateLabel(d as string));
    svg
      .select("g.x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(750)
      .call(xAxisCall as any)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#fff");

    const yAxisCall = d3.axisLeft(yScale).ticks(8).tickFormat(d3.format(".2s"));

    svg
      .select("g.y-axis")
      .transition()
      .duration(750)
      .call(yAxisCall as any)
      .selectAll("text")
      .style("fill", "#fff");

    // Update y-axis label
    svg
      .select(".y-axis-label")
      .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
      .text("Avg. Prize Pool per Tournament")
      .style("fill", "#fff");

    // 7) Create/update tooltip
    let tooltip = d3.select<HTMLDivElement, unknown>(".prize-pool-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "prize-pool-tooltip")
        .style("position", "absolute")
        .style("left", "-9999px")
        .style("top", "-9999px")
        .style("padding", "6px 8px")
        .style("background", "#333")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }

    // 8) Update bars with transitions
    const barsGroup = svg.select("g.bars-group");
    const barSelection = barsGroup
      .selectAll<
        SVGRectElement,
        [string, { avgPrizePool: number; totalTournaments: number }]
      >(".bar")
      .data(genreData, (d) => d[0]);

    // --- ENTER: new bars animate in from bottom ---
    const barEnter = barSelection
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d[0]) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d[0]));

    // --- UPDATE: merge and transition bars to new positions/sizes ---
    const barUpdate = barEnter.merge(barSelection);

    barUpdate
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("opacity", 0.8);
        tooltip
          .style("opacity", 0.9)
          .html(
            `<div><strong>${d[0]}</strong></div>
             <div>Avg Prize Pool: $${d3.format(",.0f")(d[1].avgPrizePool)}</div>
             <div>Total Tournaments: ${d3.format(",")(
               d[1].totalTournaments
             )}</div>`
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(100).attr("opacity", 1);
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(750)
      .attr("x", (d) => xScale(d[0]) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d[1].avgPrizePool))
      .attr("height", (d) => height - yScale(d[1].avgPrizePool))
      .attr("fill", (d) => colorScale(d[0]));

    // --- EXIT: bars leaving shrink and then get removed
    barSelection
      .exit()
      .transition()
      .duration(750)
      .attr("height", 0)
      .attr("y", height)
      .remove();
  }, [data, topGenres]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartColumnDecreasing className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Average Prize Pool by Genre
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
