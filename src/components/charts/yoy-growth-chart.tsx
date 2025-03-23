import { useEffect, useRef } from "react";
import { ChartBar } from "lucide-react";
import * as d3 from "d3";

interface YoYGrowthData {
  year: number;
  game: string;
  peakViewers: number;
}

interface YoYGrowthChartProps {
  data: YoYGrowthData[]; // raw CSV rows
  topNGames: number;
  topGames: string[]; // array of game names to include
}

// Utility to truncate a string from the END if it's too long
function truncateLabel(name: string, maxLen = 25) {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export default function YoYGrowthChart({
  data,
  topNGames,
  topGames,
}: YoYGrowthChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0 || topGames.length === 0) {
      console.warn("YoYGrowthChart: Missing chart element or data/topGames.");
      return;
    }

    // 1) Filter data to only include rows for games in topGames
    const filtered = data.filter((d) => topGames.includes(d.game));

    // 2) Group by game, sort by year ascending, and compute average YoY growth for each game.
    const yoyArray: { game: string; yoy: number }[] = [];
    const grouped = d3.rollups(
      filtered,
      (rows) => {
        rows.sort((a, b) => d3.ascending(a.year, b.year));
        const yoyValues: number[] = [];
        for (let i = 1; i < rows.length; i++) {
          const prev = rows[i - 1];
          const curr = rows[i];
          if (curr.year === prev.year + 1 && prev.peakViewers > 0) {
            yoyValues.push(
              (curr.peakViewers - prev.peakViewers) / prev.peakViewers
            );
          }
        }
        if (yoyValues.length > 0) {
          return d3.mean(yoyValues);
        }
        return undefined;
      },
      (d) => d.game
    );

    grouped.forEach(([game, avgYoy]) => {
      if (avgYoy !== undefined) {
        yoyArray.push({ game, yoy: avgYoy });
      }
    });

    console.log("Computed YoY array:", yoyArray);
    if (yoyArray.length === 0) {
      console.warn("YoYGrowthChart: yoyArray is empty, no bars to show.");
      d3.select(chartRef.current).selectAll("*").remove();
      return;
    }

    // 3) Dimensions
    const margin = { top: 20, right: 40, bottom: 40, left: 130 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create or select persistent SVG container groups
    let svg = d3.select(chartRef.current).select("g.chart-content");
    if (svg.empty()) {
      svg = d3
        .select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create persistent groups for axes, bars, and zero line
      svg.append("g").attr("class", "x-axis");
      svg.append("g").attr("class", "y-axis");
      svg.append("g").attr("class", "bars-group");
      svg.append("line").attr("class", "zero-line");
    } else {
      // Update svg dimensions if necessary
      d3.select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    }

    // 4) Scales
    const minYoy = d3.min(yoyArray, (d) => d.yoy) ?? 0;
    const maxYoy = d3.max(yoyArray, (d) => d.yoy) ?? 0;
    const xScale = d3
      .scaleLinear()
      .domain([minYoy, maxYoy])
      .range([0, width])
      .nice();

    // Sort the array and create a y-scale based on game names.
    yoyArray.sort((a, b) => d3.ascending(a.game, b.game));
    const yScale = d3
      .scaleBand<string>()
      .domain(yoyArray.map((d) => d.game))
      .range([0, height])
      .padding(0.2);

    const zeroX = xScale(0);

    // 5) Update zero line (vertical line at x = 0)
    svg
      .select<SVGLineElement>(".zero-line")
      .transition()
      .duration(750)
      .attr("x1", zeroX)
      .attr("x2", zeroX)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#999");

    // 6) Update axes
    const xAxisCall = d3.axisBottom(xScale).tickFormat(d3.format(".2f"));
    svg
      .select("g.x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(750)
      .call(xAxisCall);

    const yAxisCall = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickFormat((d: string) => truncateLabel(d, 25));
    svg
      .select("g.y-axis")
      .transition()
      .duration(750)
      .call(yAxisCall)
      .selectAll("text")
      .style("fill", "#fff");

    // 7) Create/update tooltip (only once)
    let tooltip = d3.select<HTMLDivElement, unknown>(".yoy-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "yoy-tooltip")
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

    // 8) Update bars with transitions (only updating the changed bars)
    const barsGroup = svg.select("g.bars-group");
    const barSelection = barsGroup
      .selectAll<SVGRectElement, { game: string; yoy: number }>(".bar")
      .data(yoyArray, (d) => d.game);

    // --- ENTER: new bars animate in from zero width ---
    const barEnter = barSelection
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.game)!)
      .attr("height", yScale.bandwidth())
      .attr("x", zeroX)
      .attr("width", 0)
      .attr("fill", "#3399ff");

    // --- UPDATE: merge and transition bars to new positions/sizes ---
    const barUpdate = barEnter.merge(barSelection);

    barUpdate
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("fill", "#66bbff");
        tooltip
          .style("opacity", 1)
          .html(
            `<div><strong>${d.game}</strong></div>
             <div>Average YoY Growth: ${d3.format(".2f")(d.yoy)}</div>`
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
        d3.select(this).transition().duration(100).attr("fill", "#3399ff");
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(750)
      .attr("y", (d) => yScale(d.game)!)
      .attr("height", yScale.bandwidth())
      .attr("x", (d) => (d.yoy < 0 ? xScale(d.yoy) : zeroX))
      .attr("width", (d) => Math.abs(xScale(d.yoy) - zeroX));

    // --- EXIT: bars leaving shrink and then get removed
    barSelection
      .exit()
      .transition()
      .duration(750)
      .attr("width", 0)
      .attr("x", zeroX)
      .remove();
  }, [data, topNGames, topGames]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartBar className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Average Year-over-Year Growth in Peak Viewers
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-300px">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
