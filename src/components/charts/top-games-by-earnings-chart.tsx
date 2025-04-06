import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartColumnDecreasing } from "lucide-react";

interface HistoricalEsportsData {
  date: number;
  game: string;
  earnings: number;
}

interface GeneralEsportsData {
  game: string;
  genre: string;
  totalEarnings: number;
  totalTournaments: number;
}

interface TopGamesByEarningsChartProps {
  historicalData: HistoricalEsportsData[];
  generalData: GeneralEsportsData[];
  topGenres: string[];
}

export default function TopGamesByEarningsChart({
  historicalData,
  generalData,
  topGenres,
}: TopGamesByEarningsChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      historicalData.length === 0 ||
      topGenres.length === 0
    ) {
      console.warn(
        "TopGamesByEarningsChart: Missing chart element or historicalData/topGenres."
      );
      return;
    }

    // Aggregate historical earnings by game.
    const aggregated = d3.rollups(
      historicalData,
      (v) => d3.sum(v, (d) => d.earnings),
      (d) => d.game
    );

    // Join with generalData to get genre for each game.
    const aggregatedData = aggregated.map(([game, totalEarnings]) => {
      const generalRecord = generalData.find((d) => d.game === game);
      return {
        game,
        totalEarnings,
        genre: generalRecord ? generalRecord.genre : "Unknown",
      };
    });

    // Optionally filter to only include games whose genre is in topGenres.
    const filteredData = aggregatedData.filter((d) =>
      topGenres.includes(d.genre)
    );

    // Sort by total earnings in descending order and take the top 10.
    filteredData.sort((a, b) =>
      d3.descending(a.totalEarnings, b.totalEarnings)
    );
    const topGames = filteredData.slice(0, 10);

    // Dimensions.
    const margin = { top: 40, right: 40, bottom: 100, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create a persistent SVG container group.
    let svg = d3
      .select(chartRef.current)
      .select("g.chart-content") as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >;

    if (svg.empty()) {
      svg = d3
        .select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create persistent groups for axes and bars.
      svg.append("g").attr("class", "x-axis");
      svg.append("g").attr("class", "y-axis");
      svg.append("g").attr("class", "bars-group");

      // Add y-axis label.
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .style("fill", "#999")
        .style("font-size", "12px");
    } else {
      // Update SVG dimensions if necessary.
      d3.select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    }

    // Scales.
    const xScale = d3
      .scaleBand<string>()
      .domain(topGames.map((d) => d.game))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(topGames, (d) => d.totalEarnings) || 0])
      .range([height, 0])
      .nice();

    // Create a colour scale based on the unique genres present in topGames.
    const uniqueGenres = Array.from(new Set(topGames.map((d) => d.genre)));
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(uniqueGenres)
      .range([
        "#3182bd",
        "#6baed6",
        "#9ecae1",
        "#c6dbef",
        "#e6550d",
        "#fd8d3c",
        "#fdae6b",
        "#fdd0a2",
        "#31a354",
        "#74c476",
        "#a1d99b",
        "#c7e9c0",
      ]);

    // Axes.
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((d) => truncateLabel(d as string, 20));
    svg
      .select<SVGGElement>("g.x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(750)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)")
      .style("fill", "#fff");

    const yAxis = d3.axisLeft(yScale).ticks(8).tickFormat(d3.format(".2s"));
    svg
      .select<SVGGElement>("g.y-axis")
      .transition()
      .duration(750)
      .call(yAxis)
      .selectAll("text")
      .style("fill", "#fff");

    svg
      .select(".y-axis-label")
      .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
      .text("Total Earnings")
      .style("fill", "#fff");

    // Create/update tooltip.
    let tooltip = d3.select<HTMLDivElement, unknown>(".earnings-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "earnings-tooltip")
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

    // Update bars with transitions.
    const barsGroup = svg.select("g.bars-group");
    const bars = barsGroup
      .selectAll<SVGRectElement, (typeof topGames)[0]>(".bar")
      .data(topGames, (d) => d.game);

    // ENTER: new bars.
    const barsEnter = bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.game) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => colorScale(d.genre));

    // UPDATE: merge and transition bars.
    const barsMerge = barsEnter.merge(bars);
    barsMerge
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("opacity", 0.8);
        tooltip
          .style("opacity", 0.9)
          .html(
            `<div><strong>${d.game}</strong></div>
             <div>Genre: ${d.genre}</div>
             <div>Total Earnings: $${d3.format(",.0f")(d.totalEarnings)}</div>`
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
      .attr("x", (d) => xScale(d.game) || 0)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.totalEarnings))
      .attr("height", (d) => height - yScale(d.totalEarnings))
      .attr("fill", (d) => colorScale(d.genre));

    // EXIT: remove old bars.
    bars
      .exit()
      .transition()
      .duration(750)
      .attr("height", 0)
      .attr("y", height)
      .remove();
  }, [historicalData, generalData, topGenres]);

  // Utility function to truncate labels.
  function truncateLabel(name: string, maxLen = 25) {
    if (name.length <= maxLen) return name;
    return name.slice(0, maxLen - 3) + "...";
  }

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartColumnDecreasing className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">Top 10 Games By Earnings</h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
