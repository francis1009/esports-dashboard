import { useEffect, useRef } from "react";
import { ChartScatter } from "lucide-react";
import * as d3 from "d3";

interface EngagementData {
  game: string;
  hoursStreamed: number;
  hoursWatched: number;
  avgViewers: number;
}

interface EngagementLevelsChartProps {
  topNGames: number;
  data: EngagementData[]; // raw CSV rows
  topGames?: string[]; // shared topGames array from parent
}

const colorMap: Record<string, string> = {
  Sports: "#8dd3c7",
  VALORANT: "#ffffb3",
  "Grand Theft Auto V": "#bebada",
  Minecraft: "#fb8072",
  "Dota 2": "#80b1d3",
  "Counter-Strike: Global Offensive": "#fdb462",
  Fortnite: "#b3de69",
  "Just Chatting": "#fccde5",
  "Special Events": "#bc80bd",
  "League of Legends": "#ffed6f",
};

export default function EngagementLevelsChart({
  topNGames,
  data,
  topGames: sharedTopGames,
}: EngagementLevelsChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // --------------------------------------------------------
    // 1) Aggregate data by game: compute averages for each game.
    // --------------------------------------------------------
    const aggregated = d3
      .rollups(
        data,
        (v) => ({
          hoursStreamed: d3.mean(v, (d) => d.hoursStreamed) ?? 0,
          hoursWatched: d3.mean(v, (d) => d.hoursWatched) ?? 0,
          avgViewers: d3.mean(v, (d) => d.avgViewers) ?? 0,
        }),
        (d) => d.game
      )
      .map(([game, values]) => ({
        game,
        ...values,
      }));

    // Use shared topGames if provided; otherwise compute from aggregated data (sorted by hoursWatched)
    const computedTopGames = aggregated
      .sort((a, b) => d3.descending(a.hoursWatched, b.hoursWatched))
      .slice(0, topNGames)
      .map((d) => d.game);
    const topGames = sharedTopGames ? sharedTopGames : computedTopGames;

    // Filter aggregated data to only include games in topGames
    const topData = aggregated.filter((d) => topGames.includes(d.game));

    // --------------------------------------------------------
    // 2) Clear previous SVG contents
    // --------------------------------------------------------
    const root = d3.select(chartRef.current);
    root.selectAll("*").remove();

    // --------------------------------------------------------
    // 3) Dimensions and margins
    // --------------------------------------------------------
    // Increase right margin for legends at top right
    const marginObj = { top: 20, right: 140, bottom: 40, left: 60 };
    const innerWidth =
      chartRef.current.clientWidth - marginObj.left - marginObj.right;
    const innerHeight = 400 - marginObj.top - marginObj.bottom;

    const svg = root
      .attr("width", innerWidth + marginObj.left + marginObj.right)
      .attr("height", innerHeight + marginObj.top + marginObj.bottom)
      .append("g")
      .attr("transform", `translate(${marginObj.left}, ${marginObj.top})`);

    // --------------------------------------------------------
    // 4) Define scales based on aggregated topData
    // --------------------------------------------------------
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(topData, (d) => d.hoursStreamed) ?? 0])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(topData, (d) => d.hoursWatched) ?? 0])
      .range([innerHeight, 0])
      .nice();

    const rScale = d3
      .scaleSqrt()
      .domain([0, d3.max(topData, (d) => d.avgViewers) ?? 0])
      .range([0, 15]);

    // --------------------------------------------------------
    // 5) Compute overall averages (for reference lines)
    // --------------------------------------------------------
    const avgStreamed = d3.mean(topData, (d) => d.hoursStreamed) ?? 0;
    const avgWatched = d3.mean(topData, (d) => d.hoursWatched) ?? 0;

    // --------------------------------------------------------
    // 6) Create a tooltip div (if not already present)
    // --------------------------------------------------------
    let tooltip = d3.select<HTMLDivElement, unknown>(".engagement-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "engagement-tooltip")
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

    // --------------------------------------------------------
    // 7) Draw average reference lines with hover interaction
    // --------------------------------------------------------
    // Draw horizontal average line (with invisible thicker overlay for hover)
    const avgWatchedLine = svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(avgWatched))
      .attr("y2", yScale(avgWatched))
      .attr("stroke", "#999")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1);

    svg
      .append("line")
      .attr("class", "avg-watched-hover")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(avgWatched))
      .attr("y2", yScale(avgWatched))
      .attr("stroke", "transparent")
      .attr("stroke-width", 10) // thicker invisible band
      .on("mouseover", (event) => {
        avgWatchedLine
          .transition()
          .duration(100)
          .attr("stroke", "#fff")
          .attr("stroke-width", 3);
        tooltip
          .style("opacity", 1)
          .html(`Avg. Hours Watched: ${d3.format(",")(Math.round(avgWatched))}`)
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", () => {
        avgWatchedLine
          .transition()
          .duration(100)
          .attr("stroke", "#999")
          .attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      });

    // Draw vertical average line (with invisible overlay)
    const avgStreamedLine = svg
      .append("line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("x1", xScale(avgStreamed))
      .attr("x2", xScale(avgStreamed))
      .attr("stroke", "#999")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1);

    svg
      .append("line")
      .attr("class", "avg-streamed-hover")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("x1", xScale(avgStreamed))
      .attr("x2", xScale(avgStreamed))
      .attr("stroke", "transparent")
      .attr("stroke-width", 10)
      .on("mouseover", (event) => {
        avgStreamedLine
          .transition()
          .duration(100)
          .attr("stroke", "#fff")
          .attr("stroke-width", 3);
        tooltip
          .style("opacity", 1)
          .html(
            `Avg. Hours Streamed: ${d3.format(",")(Math.round(avgStreamed))}`
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", () => {
        avgStreamedLine
          .transition()
          .duration(100)
          .attr("stroke", "#999")
          .attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      });

    // --------------------------------------------------------
    // 8) Draw circles with color from colorMap and add hover interactions
    // --------------------------------------------------------
    svg
      .selectAll(".game-circle")
      .data(topData)
      .join("circle")
      .attr("class", "game-circle")
      .attr("cx", (d) => xScale(d.hoursStreamed))
      .attr("cy", (d) => yScale(d.hoursWatched))
      .attr("r", (d) => rScale(d.avgViewers))
      .attr("fill", (d) => colorMap[d.game] || "#ccc")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8)
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", 3)
          .attr("opacity", 1);
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div><strong>${d.game}</strong></div>
            <div>Avg. viewers: ${d3.format(",")(Math.round(d.avgViewers))}</div>
            <div>Avg. hours streamed: ${d3.format(",")(
              Math.round(d.hoursStreamed)
            )}</div>
            <div>Avg. hours watched: ${d3.format(",")(
              Math.round(d.hoursWatched)
            )}</div>
          `
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
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", 1)
          .attr("opacity", 0.8);
        tooltip.style("opacity", 0);
      });

    // --------------------------------------------------------
    // 9) Draw labels below each circle
    // --------------------------------------------------------
    svg
      .selectAll(".game-label")
      .data(topData)
      .join("text")
      .attr("class", "game-label")
      .attr("x", (d) => xScale(d.hoursStreamed))
      .attr("y", (d) => yScale(d.hoursWatched) + rScale(d.avgViewers) + 14)
      .text((d) => d.game)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("pointer-events", "none");

    // --------------------------------------------------------
    // 10) Draw axes with labels "Avg. Hours Streamed" / "Avg. Hours Watched"
    // --------------------------------------------------------
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(".2s"));
    svg
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis);

    svg
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 35)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text("Avg. Hours Streamed");

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".2s"));
    svg.append("g").call(yAxis);

    svg
      .append("text")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .attr("transform", "rotate(-90)")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .text("Avg. Hours Watched");

    // Optionally label the average lines (if desired)
    svg
      .append("text")
      .attr("x", xScale(avgStreamed) + 5)
      .attr("y", innerHeight - 10)
      .attr("fill", "#999")
      .text("Average");

    svg
      .append("text")
      .attr("x", 5)
      .attr("y", yScale(avgWatched) - 5)
      .attr("fill", "#999")
      .text("Average");

    // --------------------------------------------------------
    // 11) SIZE LEGEND (5 steps) at the TOP RIGHT, labeled "Avg. Viewers"
    // --------------------------------------------------------
    const sizeLegendG = svg
      .append("g")
      .attr("class", "size-legend")
      .attr("transform", `translate(${innerWidth + 20}, 0)`);

    sizeLegendG
      .append("text")
      .text("Avg. Viewers")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .attr("y", 0);

    const sizeValues = [50000, 100000, 150000, 200000, 300000];
    sizeLegendG
      .selectAll(".size-legend-item")
      .data(sizeValues)
      .join("g")
      .attr("class", "size-legend-item")
      .attr("transform", (_d, i) => `translate(0, ${20 + i * 40})`)
      .call((g) =>
        g
          .append("circle")
          .attr("r", (d) => rScale(d))
          .attr("fill", "#ccc")
          .attr("stroke", "#333")
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", (d) => rScale(d) + 8)
          .attr("y", 4)
          .attr("fill", "#fff")
          .style("font-size", "12px")
          .text((d) => d3.format(",")(d))
      );
  }, [data, topNGames, sharedTopGames]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden col-span-1">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartScatter className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">Engagement Levels</h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-300px">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
