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
    // If no valid ref or no data, skip
    if (!chartRef.current || data.length === 0) return;

    // --------------------------------------------------------
    // 1) Aggregate data by game (averages for each game)
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

    // Decide which games to display (use sharedTopGames or compute top by hoursWatched)
    const computedTopGames = aggregated
      .sort((a, b) => d3.descending(a.hoursWatched, b.hoursWatched))
      .slice(0, topNGames)
      .map((d) => d.game);

    const finalTopGames = sharedTopGames || computedTopGames;

    // Filter data to only include these top games
    const topData = aggregated.filter((d) => finalTopGames.includes(d.game));
    if (topData.length === 0) return;

    // --------------------------------------------------------
    // 2) Dimensions and margins
    // --------------------------------------------------------
    const marginObj = { top: 20, right: 140, bottom: 40, left: 60 };
    const innerWidth =
      chartRef.current.clientWidth - marginObj.left - marginObj.right;
    const innerHeight = 400 - marginObj.top - marginObj.bottom;

    // --------------------------------------------------------
    // 3) Create or select persistent <g> container
    // --------------------------------------------------------
    const root = d3.select(chartRef.current);

    let svg = root.select<SVGGElement>("g.chart-content");
    if (svg.empty()) {
      // Create once
      svg = root
        .attr("width", innerWidth + marginObj.left + marginObj.right)
        .attr("height", innerHeight + marginObj.top + marginObj.bottom)
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${marginObj.left}, ${marginObj.top})`);

      // Create axis groups
      svg.append("g").attr("class", "x-axis");
      svg.append("g").attr("class", "y-axis");

      // Create group for average lines
      svg.append("g").attr("class", "avg-lines-group");

      // Create group for circles
      svg.append("g").attr("class", "circles-group");

      // Create group for labels
      svg.append("g").attr("class", "labels-group");

      // Create group for size legend
      svg.append("g").attr("class", "size-legend");
    } else {
      // Update width/height if the container size changed
      root
        .attr("width", innerWidth + marginObj.left + marginObj.right)
        .attr("height", innerHeight + marginObj.top + marginObj.bottom);
    }

    // --------------------------------------------------------
    // 4) Define scales
    // --------------------------------------------------------
    const xMax = d3.max(topData, (d) => d.hoursStreamed) ?? 0;
    const yMax = d3.max(topData, (d) => d.hoursWatched) ?? 0;
    const rMax = d3.max(topData, (d) => d.avgViewers) ?? 0;

    const xScale = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([0, innerWidth])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([innerHeight, 0])
      .nice();
    const rScale = d3.scaleSqrt().domain([0, rMax]).range([0, 15]);

    // --------------------------------------------------------
    // 5) Compute overall averages for reference lines
    // --------------------------------------------------------
    const avgStreamed = d3.mean(topData, (d) => d.hoursStreamed) ?? 0;
    const avgWatched = d3.mean(topData, (d) => d.hoursWatched) ?? 0;

    // --------------------------------------------------------
    // 6) Tooltip (create once if not already present)
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
    // 7) Update average lines (with transitions)
    // --------------------------------------------------------
    const avgLinesGroup = svg.select<SVGGElement>("g.avg-lines-group");

    // Horizontal line (avgWatched)
    let avgWatchedLine = avgLinesGroup.select<SVGLineElement>(
      "line.avg-watched-line"
    );
    if (avgWatchedLine.empty()) {
      avgWatchedLine = avgLinesGroup
        .append("line")
        .attr("class", "avg-watched-line")
        .attr("stroke-dasharray", "3,3")
        .attr("stroke", "#999")
        .attr("stroke-width", 1);
    }
    avgWatchedLine
      .transition()
      .duration(750)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(avgWatched))
      .attr("y2", yScale(avgWatched));

    // Hover overlay for horizontal line
    let avgWatchedHover = avgLinesGroup.select<SVGLineElement>(
      "line.avg-watched-hover"
    );
    if (avgWatchedHover.empty()) {
      avgWatchedHover = avgLinesGroup
        .append("line")
        .attr("class", "avg-watched-hover")
        .attr("stroke", "transparent")
        .attr("stroke-width", 10);
    }
    avgWatchedHover
      .transition()
      .duration(750)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", yScale(avgWatched))
      .attr("y2", yScale(avgWatched));

    avgWatchedHover
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

    // Vertical line (avgStreamed)
    let avgStreamedLine = avgLinesGroup.select<SVGLineElement>(
      "line.avg-streamed-line"
    );
    if (avgStreamedLine.empty()) {
      avgStreamedLine = avgLinesGroup
        .append("line")
        .attr("class", "avg-streamed-line")
        .attr("stroke-dasharray", "3,3")
        .attr("stroke", "#999")
        .attr("stroke-width", 1);
    }
    avgStreamedLine
      .transition()
      .duration(750)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("x1", xScale(avgStreamed))
      .attr("x2", xScale(avgStreamed));

    // Hover overlay for vertical line
    let avgStreamedHover = avgLinesGroup.select<SVGLineElement>(
      "line.avg-streamed-hover"
    );
    if (avgStreamedHover.empty()) {
      avgStreamedHover = avgLinesGroup
        .append("line")
        .attr("class", "avg-streamed-hover")
        .attr("stroke", "transparent")
        .attr("stroke-width", 10);
    }
    avgStreamedHover
      .transition()
      .duration(750)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("x1", xScale(avgStreamed))
      .attr("x2", xScale(avgStreamed));

    avgStreamedHover
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
    // 8) Circles (bubbles) - Enter/Update/Exit
    // --------------------------------------------------------
    const circlesGroup = svg.select<SVGGElement>("g.circles-group");

    // Bind data with a key function: each circle is identified by the game name
    const circleSelection = circlesGroup
      .selectAll<SVGCircleElement, (typeof topData)[0]>("circle.game-circle")
      .data(topData, (d) => d.game);

    // ENTER
    const circleEnter = circleSelection
      .enter()
      .append("circle")
      .attr("class", "game-circle")
      .attr("cx", (d) => xScale(d.hoursStreamed))
      .attr("cy", (d) => yScale(d.hoursWatched))
      .attr("r", 0) // start new circles at radius 0
      .attr("fill", (d) => colorMap[d.game] || "#ccc")
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8);

    // UPDATE (merge) + transitions
    const circleUpdate = circleEnter.merge(circleSelection);

    circleUpdate
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", 3)
          .attr("opacity", 1);
        tooltip
          .style("opacity", 1)
          .html(
            `<div><strong>${d.game}</strong></div>
             <div>Avg. viewers: ${d3.format(",")(
               Math.round(d.avgViewers)
             )}</div>
             <div>Avg. hours streamed: ${d3.format(",")(
               Math.round(d.hoursStreamed)
             )}</div>
             <div>Avg. hours watched: ${d3.format(",")(
               Math.round(d.hoursWatched)
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
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", 1)
          .attr("opacity", 0.8);
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.hoursStreamed))
      .attr("cy", (d) => yScale(d.hoursWatched))
      .attr("r", (d) => rScale(d.avgViewers));

    // EXIT
    circleSelection.exit().transition().duration(750).attr("r", 0).remove();

    // --------------------------------------------------------
    // 9) Labels - Enter/Update/Exit
    // --------------------------------------------------------
    const labelsGroup = svg.select<SVGGElement>("g.labels-group");
    const labelSelection = labelsGroup
      .selectAll<SVGTextElement, (typeof topData)[0]>("text.game-label")
      .data(topData, (d) => d.game);

    // ENTER
    const labelEnter = labelSelection
      .enter()
      .append("text")
      .attr("class", "game-label")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .style("pointer-events", "none")
      // start new labels at y = circle center
      .attr("x", (d) => xScale(d.hoursStreamed))
      .attr("y", (d) => yScale(d.hoursWatched))
      .attr("opacity", 0)
      .text((d) => d.game);

    // UPDATE (merge)
    labelEnter
      .merge(labelSelection)
      .transition()
      .duration(750)
      .attr("x", (d) => xScale(d.hoursStreamed))
      // place label below the circle by its radius + some padding
      .attr("y", (d) => yScale(d.hoursWatched) + rScale(d.avgViewers) + 14)
      .attr("opacity", 1);

    // EXIT
    labelSelection
      .exit()
      .transition()
      .duration(750)
      .attr("opacity", 0)
      .remove();

    // --------------------------------------------------------
    // 10) Axes
    // --------------------------------------------------------
    const xAxisGroup = svg
      .select<SVGGElement>("g.x-axis")
      .attr("transform", `translate(0, ${innerHeight})`);
    xAxisGroup
      .transition()
      .duration(750)
      .call(d3.axisBottom(xScale).tickFormat(d3.format(".2s")));

    const yAxisGroup = svg.select<SVGGElement>("g.y-axis");
    yAxisGroup
      .transition()
      .duration(750)
      .call(d3.axisLeft(yScale).tickFormat(d3.format(".2s")));

    // Axis labels (create once if you want them persistent)
    if (svg.selectAll("text.x-axis-label").empty()) {
      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 35)
        .text("Avg. Hours Streamed");
    }

    if (svg.selectAll("text.y-axis-label").empty()) {
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle")
        .attr("x", -innerHeight / 2)
        .attr("y", -45)
        .attr("transform", "rotate(-90)")
        .text("Avg. Hours Watched");
    }

    // --------------------------------------------------------
    // 11) Size legend (persistent)
    // --------------------------------------------------------
    const sizeLegendG = svg
      .select<SVGGElement>("g.size-legend")
      .attr("transform", `translate(${innerWidth + 20}, 0)`);

    // If no legend title yet, add it
    if (sizeLegendG.selectAll("text.size-legend-title").empty()) {
      sizeLegendG
        .append("text")
        .attr("class", "size-legend-title")
        .text("Avg. Viewers")
        .attr("fill", "#fff")
        .style("font-size", "12px")
        .attr("y", 0);
    }

    const sizeValues = [50_000, 100_000, 150_000, 200_000, 250_000];
    const legendItems = sizeLegendG
      .selectAll<SVGGElement, number>("g.size-legend-item")
      .data(sizeValues);

    // ENTER
    const legendEnter = legendItems
      .enter()
      .append("g")
      .attr("class", "size-legend-item");

    legendEnter
      .append("circle")
      .attr("fill", "#ccc")
      .attr("stroke", "#333")
      .attr("cy", 0);

    legendEnter
      .append("text")
      .attr("fill", "#fff")
      .style("font-size", "12px")
      .attr("x", 0)
      .attr("y", 4);

    // UPDATE (merge)
    const legendUpdate = legendEnter.merge(legendItems);

    legendUpdate
      .attr("transform", (_d, i) => `translate(0, ${20 + i * 40})`)
      .select("circle")
      .transition()
      .duration(750)
      .attr("r", (d) => rScale(d));

    legendUpdate
      .select("text")
      .transition()
      .duration(750)
      .attr("x", (d) => rScale(d) + 8)
      .text((d) => d3.format(",")(d));

    // EXIT
    legendItems.exit().remove();
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
