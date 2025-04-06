import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartLine } from "lucide-react";

interface ViewershipData {
  year: number;
  game: string;
  peakViewers: number;
  hoursStreamed: number;
  hoursWatched: number;
  avgViewers: number;
}

interface GeneralEsportsData {
  game: string;
  genre: string;
  totalEarnings: number;
  totalTournaments: number;
}

interface ViewershipVsEarningsChartProps {
  viewershipData: ViewershipData[];
  generalEsportsData: GeneralEsportsData[];
  topGenres: string[];
}

export default function ViewershipVsEarningsChart({
  viewershipData,
  generalEsportsData,
  topGenres,
}: ViewershipVsEarningsChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      viewershipData.length === 0 ||
      generalEsportsData.length === 0
    ) {
      console.warn("ViewershipVsEarningsChart: Missing required data.");
      return;
    }

    // 1) Join each viewership record with its earnings info from general data.
    //    Also attach the genre and filter by topGenres.
    const joinedData = viewershipData
      .map((d) => {
        const earningInfo = generalEsportsData.find((e) => e.game === d.game);
        return {
          ...d,
          earnings: earningInfo ? earningInfo.totalEarnings : 0,
          genre: earningInfo ? earningInfo.genre : "Unknown",
        };
      })
      .filter((d) => topGenres.includes(d.genre));

    // 2) Aggregate data by year.
    const hoursWatchedByYear = Array.from(
      d3.rollup(
        joinedData,
        (v) => d3.mean(v, (d) => d.hoursWatched) || 0,
        (d) => d.year
      )
    ).map(([year, avgHoursWatched]) => ({
      year: +year,
      avgHoursWatched,
    }));

    const earningsByYear = Array.from(
      d3.rollup(
        joinedData,
        (v) => d3.mean(v, (d) => d.earnings) || 0,
        (d) => d.year
      )
    ).map(([year, avgEarnings]) => ({
      year: +year,
      avgEarnings,
    }));

    // 3) Merge the series into one array sorted by year.
    const allYearsSet = new Set<number>();
    hoursWatchedByYear.forEach((d) => allYearsSet.add(d.year));
    earningsByYear.forEach((d) => allYearsSet.add(d.year));

    const mergedData = Array.from(allYearsSet)
      .map((year) => {
        const hw =
          hoursWatchedByYear.find((d) => d.year === year)?.avgHoursWatched || 0;
        const earnings =
          earningsByYear.find((d) => d.year === year)?.avgEarnings || 0;
        return { year, avgHoursWatched: hw, avgEarnings: earnings };
      })
      .sort((a, b) => a.year - b.year);

    // 4) Define chart dimensions.
    const margin = { top: 40, right: 60, bottom: 50, left: 60 };
    const containerWidth = chartRef.current.clientWidth;
    const svgHeight = 500;
    const width = containerWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // 5) Set up the SVG container.
    const svg = d3
      .select(chartRef.current)
      .attr("width", containerWidth)
      .attr("height", svgHeight);

    // Create or select the main group.
    let g = svg.select<SVGGElement>("g.chart-content");
    if (g.empty()) {
      g = svg
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    } else {
      g.attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // 6) Define scales.
    const xExtent = d3.extent(mergedData, (d) => d.year) as [number, number];
    const xScale = d3.scaleLinear().domain(xExtent).range([0, width]).nice();

    const maxHours = d3.max(mergedData, (d) => d.avgHoursWatched) || 0;
    const yLeftScale = d3
      .scaleLinear()
      .domain([0, maxHours])
      .range([height, 0])
      .nice();

    const maxEarnings = d3.max(mergedData, (d) => d.avgEarnings) || 0;
    const yRightScale = d3
      .scaleLinear()
      .domain([0, maxEarnings])
      .range([height, 0])
      .nice();

    // 7) Create (or update) axes.
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yLeftAxis = d3
      .axisLeft(yLeftScale)
      .ticks(6)
      .tickFormat(d3.format(".2s"));
    const yRightAxis = d3
      .axisRight(yRightScale)
      .ticks(6)
      .tickFormat(d3.format(".2s"));

    // Instead of removing axes, update them smoothly.
    let xAxisGroup = g.select("g.x-axis") as any;
    if (xAxisGroup.empty()) {
      xAxisGroup = g
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`);
    }
    xAxisGroup.transition().duration(750).call(xAxis);

    let yLeftAxisGroup = g.select("g.y-axis-left") as any;
    if (yLeftAxisGroup.empty()) {
      yLeftAxisGroup = g.append("g").attr("class", "y-axis-left");
    }
    yLeftAxisGroup.transition().duration(750).call(yLeftAxis);

    let yRightAxisGroup = g.select("g.y-axis-right") as any;
    if (yRightAxisGroup.empty()) {
      yRightAxisGroup = g
        .append("g")
        .attr("class", "y-axis-right")
        .attr("transform", `translate(${width}, 0)`);
    }
    yRightAxisGroup.transition().duration(750).call(yRightAxis);

    // 8) Create line generators.
    const lineHours = d3
      .line<{ year: number; avgHoursWatched: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yLeftScale(d.avgHoursWatched))
      .curve(d3.curveMonotoneX);

    const lineEarnings = d3
      .line<{ year: number; avgEarnings: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yRightScale(d.avgEarnings))
      .curve(d3.curveMonotoneX);

    // 9) Update the lines using data join and transition.
    const hoursLine = g
      .selectAll<SVGPathElement, any>(".line-hours")
      .data([mergedData]);
    hoursLine
      .enter()
      .append("path")
      .attr("class", "line-hours")
      .attr("fill", "none")
      .attr("stroke", "#1f77b4")
      .attr("stroke-width", 2)
      .merge(hoursLine)
      .transition()
      .duration(750)
      .attr("d", lineHours);
    hoursLine.exit().remove();

    const earningsLine = g
      .selectAll<SVGPathElement, any>(".line-earnings")
      .data([mergedData]);
    earningsLine
      .enter()
      .append("path")
      .attr("class", "line-earnings")
      .attr("fill", "none")
      .attr("stroke", "#ff7f0e")
      .attr("stroke-width", 2)
      .merge(earningsLine)
      .transition()
      .duration(750)
      .attr("d", lineEarnings);
    earningsLine.exit().remove();

    // 10) Add axis labels.
    g.selectAll(".y-axis-label-left").remove();
    g.append("text")
      .attr("class", "y-axis-label-left")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-40, ${height / 2}) rotate(-90)`)
      .style("fill", "#fff")
      .attr("font-size", "14px")
      .text("Avg. Hours Watched");

    g.selectAll(".y-axis-label-right").remove();
    g.append("text")
      .attr("class", "y-axis-label-right")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width + 40}, ${height / 2}) rotate(90)`)
      .style("fill", "#fff")
      .attr("font-size", "14px")
      .text("Avg. Total Earnings");

    g.selectAll(".x-axis-label").remove();
    g.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        `translate(${width / 2}, ${height + margin.bottom - 10})`
      )
      .style("fill", "#fff")
      .text("Year");

    // 11) Create dot markers (if not already present) with white fill.
    if (g.selectAll(".dot-hours").empty()) {
      g.append("circle")
        .attr("class", "dot-hours")
        .attr("r", 4)
        .attr("fill", "#ffffff")
        .style("opacity", 0);
    }
    if (g.selectAll(".dot-earnings").empty()) {
      g.append("circle")
        .attr("class", "dot-earnings")
        .attr("r", 4)
        .attr("fill", "#ffffff")
        .style("opacity", 0);
    }

    // 12) Create a tooltip if it does not exist.
    let tooltip = d3.select<HTMLDivElement, unknown>(".linechart-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "linechart-tooltip")
        .style("position", "absolute")
        .style("background", "#333")
        .style("color", "#fff")
        .style("padding", "6px 8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("left", "-9999px")
        .style("top", "-9999px");
    }

    // 13) Add an overlay rectangle for mouse events that update tooltip and dot markers.
    g.selectAll(".overlay").remove();
    g.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);
        const x0 = xScale.invert(mouseX);
        const bisect = d3.bisector((d: { year: number }) => d.year).left;
        const index = bisect(mergedData, x0);
        let d0;
        if (index === 0) {
          d0 = mergedData[0];
        } else if (index >= mergedData.length) {
          d0 = mergedData[mergedData.length - 1];
        } else {
          const dBefore = mergedData[index - 1];
          const dAfter = mergedData[index];
          d0 = x0 - dBefore.year > dAfter.year - x0 ? dAfter : dBefore;
        }
        // Update tooltip.
        tooltip
          .html(
            `<div><strong>Year: ${d0.year}</strong></div>
             <div>Avg Hours Watched: ${d3.format(",.0f")(
               d0.avgHoursWatched
             )}</div>
             <div>Avg Total Earnings: $${d3.format(",.0f")(
               d0.avgEarnings
             )}</div>`
          )
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px")
          .style("opacity", 0.9);

        // Update and raise dot markers.
        g.select(".dot-hours")
          .attr("cx", xScale(d0.year))
          .attr("cy", yLeftScale(d0.avgHoursWatched))
          .style("opacity", 1)
          .raise();
        g.select(".dot-earnings")
          .attr("cx", xScale(d0.year))
          .attr("cy", yRightScale(d0.avgEarnings))
          .style("opacity", 1)
          .raise();
      })
      .on("mouseout", function () {
        tooltip.transition().duration(100).style("opacity", 0);
        g.select(".dot-hours").transition().duration(100).style("opacity", 0);
        g.select(".dot-earnings")
          .transition()
          .duration(100)
          .style("opacity", 0);
      });

    // 14) Add (or update) a legend in the bottom right.
    svg.selectAll(".legend").remove();
    const legendData = [
      { label: "Avg. Hours Watched", color: "#1f77b4" },
      { label: "Avg. Total Earnings", color: "#ff7f0e" },
    ];
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${containerWidth - margin.right - 150}, ${
          svgHeight - margin.bottom - 50
        })`
      );
    legendData.forEach((d, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      legendItem
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d.color);
      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("fill", "#fff")
        .attr("font-size", "12px")
        .text(d.label);
    });
  }, [viewershipData, generalEsportsData, topGenres]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartLine className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Viewership vs Earnings Over Time
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
