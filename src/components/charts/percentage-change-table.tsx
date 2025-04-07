import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Grid3X3 } from "lucide-react";

interface RevenueChangeData {
  market: string;
  year: number; // already in YYYY format
  revenueChange: number;
}

interface PercentageChangeTableProps {
  revenueChangeData: RevenueChangeData[];
}

export default function PercentageChangeTable({
  revenueChangeData,
}: PercentageChangeTableProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || revenueChangeData.length === 0) {
      console.warn("PercentageChangeTable: Missing required data.");
      return;
    }

    // Clear any previous content.
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    // Create (or reselect) a tooltip for cell hover info.
    let tooltip = d3.select("body").select(".cell-tooltip") as any;
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "cell-tooltip")
        .style("position", "absolute")
        .style("padding", "8px 12px")
        .style("background", "#333")
        .style("color", "#fff")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", "0")
        .style("left", "-9999px")
        .style("top", "-9999px");
    }

    // Set margins and dimensions for each cell.
    const margin = { top: 50, right: 10, bottom: 30, left: 250 };
    const cellWidth = 80;
    const cellHeight = 40;

    // Get unique markets (rows) and years (columns).
    const markets = Array.from(new Set(revenueChangeData.map((d) => d.market)));
    markets.sort((a, b) => a.localeCompare(b));

    const years = Array.from(
      new Set(revenueChangeData.map((d) => d.year))
    ) as number[];
    years.sort((a, b) => a - b);

    // Create a lookup map keyed on "market-year" so we can easily retrieve the value.
    const dataMap = new Map<string, number>();
    revenueChangeData.forEach((d) => {
      dataMap.set(`${d.market}-${d.year}`, d.revenueChange);
    });

    // Compute the maximum absolute revenue change.
    const maxAbsVal =
      d3.max(revenueChangeData, (d) => Math.abs(d.revenueChange)) || 0;

    // Create a diverging color scale.
    // Negative values go toward red, positive toward green.
    const colorScale = d3
      .scaleDiverging<number>()
      .domain([-maxAbsVal, 0, maxAbsVal])
      .interpolator(d3.interpolateRdYlGn as unknown as (t: number) => number);

    // Compute overall dimensions of the SVG.
    const svgWidth = margin.left + years.length * cellWidth + margin.right;
    const svgHeight = margin.top + markets.length * cellHeight + margin.bottom;
    svg
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Create a chart group with proper margins.
    const chartGroup = svg
      .append("g")
      .attr("class", "chart-group")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create one row per market.
    const rows = chartGroup
      .selectAll(".row")
      .data(markets)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", (_, i) => `translate(0, ${i * cellHeight})`);

    // For each row, add a rectangle for each year.
    rows
      .selectAll("rect")
      .data((market) =>
        years.map((year) => ({
          market,
          year,
          value: dataMap.get(`${market}-${year}`),
        }))
      )
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * cellWidth)
      .attr("width", cellWidth)
      .attr("height", cellHeight)
      .attr("fill", (d) =>
        d.value !== undefined ? colorScale(d.value) : "#ccc"
      )
      .attr("stroke", "#fff")
      // Add tooltip events for each cell.
      .on("mouseover", function (_, d) {
        tooltip
          .html(
            `<strong>${d.market}</strong><br/>Year: ${
              d.year
            }<br/>Percentage Change: ${d3.format(".1f")(d.value || 0)}%`
          )
          .style("opacity", "0.9");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", "0");
      });

    // Add text labels to each cell.
    rows
      .selectAll("text")
      .data((market) =>
        years.map((year) => ({
          market,
          year,
          value: dataMap.get(`${market}-${year}`),
        }))
      )
      .enter()
      .append("text")
      .attr("x", (_, i) => i * cellWidth + cellWidth / 2)
      .attr("y", cellHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      // Disable pointer events on the text so it doesn't block mouse events.
      .style("pointer-events", "none")
      // Dynamically set the text color based on cell background luminance.
      .style("fill", (d) => {
        const bgColor = d.value !== undefined ? colorScale(d.value) : "#ccc";
        const luminance = d3.hsl(bgColor as string).l;
        return luminance < 0.5 ? "#fff" : "#000";
      })
      .text((d) => (d.value !== undefined ? d3.format(".1f")(d.value) : ""));

    // Add column labels for years.
    const colLabels = chartGroup.append("g").attr("class", "col-labels");
    colLabels
      .selectAll("text")
      .data(years)
      .enter()
      .append("text")
      .attr("x", (_, i) => i * cellWidth + cellWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .style("fill", "#fff")
      .text((d) => d);

    // Add row labels for markets.
    const rowLabels = chartGroup.append("g").attr("class", "row-labels");
    rowLabels
      .selectAll("text")
      .data(markets)
      .enter()
      .append("text")
      .attr("x", -10)
      .attr("y", (_, i) => i * cellHeight + cellHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .style("font-weight", "bold")
      .style("fill", "#fff")
      .text((d) => d);
  }, [revenueChangeData]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <Grid3X3 className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Percentage Change in Revenue by Market
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center">
        <svg ref={chartRef} />
      </div>
    </div>
  );
}
