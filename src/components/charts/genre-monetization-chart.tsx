import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartColumn } from "lucide-react";

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

interface GenreMonetizationChartProps {
  viewershipData: ViewershipData[];
  generalEsportsData: GeneralEsportsData[];
  topGenres: string[];
}

function truncateLabel(name: string, maxLen = 25) {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export default function GenreMonetizationChart({
  viewershipData,
  generalEsportsData,
  topGenres,
}: GenreMonetizationChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      viewershipData.length === 0 ||
      generalEsportsData.length === 0
    ) {
      console.warn("GenreMonetizationChart: Missing required data.");
      return;
    }

    // Clear any previous SVG content.
    d3.select(chartRef.current).selectAll("*").remove();

    /*
      1) Join each viewership record with its matching general esports record using the "game" field.
         Attach the "earnings" and "genre" from general data.
         Then filter the joined data to only include records whose genres are contained in topGenres.
    */
    const joinedData = viewershipData
      .map((d) => {
        const match = generalEsportsData.find((e) => e.game === d.game);
        return {
          ...d,
          earnings: match ? match.totalEarnings : 0,
          genre: match ? match.genre : "Unknown",
        };
      })
      .filter((d) => topGenres.includes(d.genre));

    /*
      2) Aggregate data by genre.
         Use d3.rollup to group the data by genre and compute:
           - avgHoursWatched: the mean of d.hoursWatched for the group.
           - avgEarnings: the mean of d.earnings for the group.
    */
    const genreRollup = d3.rollup(
      joinedData,
      (v) => ({
        avgHoursWatched: d3.mean(v, (d) => d.hoursWatched) ?? 0,
        avgEarnings: d3.mean(v, (d) => d.earnings) ?? 0,
      }),
      (d) => d.genre
    );

    const aggregatedData = Array.from(genreRollup, ([genre, metrics]) => ({
      genre,
      ...metrics,
    }));

    // (Optional) Sort the aggregated data by genre name.
    aggregatedData.sort((a, b) => a.genre.localeCompare(b.genre));

    // 3) Define chart dimensions.
    const margin = { top: 40, right: 40, bottom: 100, left: 60 };
    const containerWidth = chartRef.current.clientWidth;
    const svgHeight = 500;
    const width = containerWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // 4) Create the SVG container.
    const svg = d3
      .select(chartRef.current)
      .attr("width", containerWidth)
      .attr("height", svgHeight);

    // Create a main group for the chart and translate it by the margins.
    const g = svg
      .append("g")
      .attr("class", "chart-content")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 5) Create scales.
    // Outer x scale: positions each genre along the x-axis.
    const x0 = d3
      .scaleBand<string>()
      .domain(aggregatedData.map((d) => d.genre))
      .range([0, width])
      .padding(0.3);

    // Inner x scale: within each genre, space for the two metrics.
    const metrics = ["avgHoursWatched", "avgEarnings"];
    const x1 = d3
      .scaleBand<string>()
      .domain(metrics)
      .range([0, x0.bandwidth()])
      .padding(0.1);

    // Common y scale: based on the maximum value across both metrics.
    const maxVal =
      d3.max(aggregatedData, (d) =>
        Math.max(d.avgHoursWatched, d.avgEarnings)
      ) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal])
      .range([height, 0])
      .nice();

    // 6) Create axes.
    const xAxis = d3.axisBottom(x0).tickFormat((d) => truncateLabel(d));
    const yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(d3.format(".2s"));

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(750)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-45)")
      .style("fill", "#fff");

    g.append("g")
      .attr("class", "y-axis")
      .transition()
      .duration(750)
      .call(yAxis)
      .selectAll("text")
      .style("fill", "#fff");

    // 7) Create a color scale for the two metrics.
    const color = d3
      .scaleOrdinal<string>()
      .domain(metrics)
      .range(["#1f77b4", "#ff7f0e"]);

    // 8) Create a group for each genre.
    const genreGroups = g
      .selectAll(".genre-group")
      .data(aggregatedData)
      .enter()
      .append("g")
      .attr("class", "genre-group")
      .attr("transform", (d) => `translate(${x0(d.genre)}, 0)`);

    // 9) Create the bars within each genre group.
    // For each genre group, create two bars: one for avgHoursWatched and one for avgEarnings.
    // Note: We now also pass "genre" for the tooltip.
    genreGroups
      .selectAll("rect")
      .data((d) =>
        metrics.map((key) => ({
          key,
          value: (d as any)[key],
          genre: d.genre,
        }))
      )
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.key)!)
      .attr("y", () => yScale(0))
      .attr("width", x1.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => color(d.key)!)
      .transition()
      .duration(750)
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value));

    // 10) Create a tooltip.
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "genre-monetization-tooltip")
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

    // 11) Add mouse events to the bars to display the tooltip.
    // Now the tooltip shows the genre in bold on the first line, then either:
    //   "Avg. Hours Watched: <value>" or "Avg. Total Earnings: $<value>" in the next line.
    genreGroups
      .selectAll("rect")
      .on("mouseover", (event, d: any) => {
        let htmlContent = `<div><strong>${d.genre}</strong></div>`;
        if (d.key === "avgHoursWatched") {
          htmlContent += `<div>Avg. Hours Watched: ${d3.format(",.0f")(
            d.value
          )}</div>`;
        } else {
          htmlContent += `<div>Avg. Total Earnings: $${d3.format(",.0f")(
            d.value
          )}</div>`;
        }
        tooltip
          .html(htmlContent)
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px")
          .transition()
          .duration(200)
          .style("opacity", 0.9);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(100).style("opacity", 0);
      });

    // 12) Add a legend at the top right.
    const legendData = [
      { label: "Avg Hours Watched", key: "avgHoursWatched", color: "#1f77b4" },
      { label: "Avg Total Earnings", key: "avgEarnings", color: "#ff7f0e" },
    ];
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${containerWidth - margin.right - 150}, ${margin.top - 20})`
      );

    const legendItems = legend
      .selectAll(".legend-item")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(0, ${i * 20})`);

    legendItems
      .append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => d.color);

    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("fill", "#fff")
      .style("font-size", "12px")
      .text((d) => d.label);
  }, [viewershipData, generalEsportsData, topGenres]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartColumn className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">Genre Monetization</h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
