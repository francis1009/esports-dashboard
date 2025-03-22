import { useEffect, useRef } from "react";
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
    // For each game, for every consecutive pair, compute:
    //   (current.peakViewers - previous.peakViewers) / previous.peakViewers,
    // then average these values.
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

    // Clear previous chart content
    const root = d3.select(chartRef.current);
    root.selectAll("*").remove();

    const svg = root
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 4) X scale (decimal yoy)
    const minYoy = d3.min(yoyArray, (d) => d.yoy) ?? 0;
    const maxYoy = d3.max(yoyArray, (d) => d.yoy) ?? 0;
    const xScale = d3
      .scaleLinear()
      .domain([minYoy, maxYoy])
      .range([0, width])
      .nice();

    // 5) Y scale (band for each game)
    yoyArray.sort((a, b) => d3.ascending(a.game, b.game));
    const yScale = d3
      .scaleBand<string>()
      .domain(yoyArray.map((d) => d.game))
      .range([0, height])
      .padding(0.2);

    // 6) Draw vertical zero line
    const zeroX = xScale(0);
    svg
      .append("line")
      .attr("x1", zeroX)
      .attr("x2", zeroX)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#999");

    // 7) Create tooltip div (consistent with PeakViewersChart)
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

    // 8) Draw bars with tooltip and glow effect on hover
    svg
      .selectAll(".bar")
      .data(yoyArray)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.game)!)
      .attr("height", yScale.bandwidth())
      .attr("x", (d) => (d.yoy < 0 ? xScale(d.yoy) : zeroX))
      .attr("width", (d) => Math.abs(xScale(d.yoy) - zeroX))
      .attr("fill", "#3399ff")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(100).attr("fill", "#66bbff");
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div><strong>${d.game}</strong></div>
            <div>YoY Growth: ${d3.format(".2f")(d.yoy)}</div>
          `
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(100).attr("fill", "#3399ff");
        tooltip.style("opacity", 0);
      });

    // 10) Draw X Axis (decimal format)
    const xAxis = d3.axisBottom<number>(xScale).tickFormat(d3.format(".2f"));
    svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

    // 11) Draw Y Axis with truncated game labels
    const yAxisCall = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickFormat((d: string) => truncateLabel(d, 25));

    svg.append("g").call(yAxisCall).selectAll("text").style("fill", "#fff");
  }, [data, topNGames, topGames]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <h3 className="font-medium text-white">
          Year-over-Year Growth in Peak Viewers
        </h3>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-300px">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
