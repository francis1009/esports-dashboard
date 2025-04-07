import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartColumnStacked } from "lucide-react";

interface RevenueByMarketData {
  actualOrForecast: string; // "actual" or "forecast"
  market: string;
  year: number;
  revenue: number;
}

interface RevenueChangeData {
  market: string;
  year: number;
  revenueChange: number;
}

interface RevenueByMarketStackedBarChartProps {
  revenueByMarketData: RevenueByMarketData[];
  revenueChangeData: RevenueChangeData[];
}

// Utility to truncate a string from the END if it's too long
function truncateLabel(name: string, maxLen = 25) {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export default function RevenueByMarketStackedBarChart({
  revenueByMarketData,
  revenueChangeData,
}: RevenueByMarketStackedBarChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      revenueByMarketData.length === 0 ||
      revenueChangeData.length === 0
    ) {
      console.warn("RevenueByMarketStackedBarChart: Missing required data.");
      return;
    }

    // Clear any previous content.
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    // Create (or reselect) a tooltip.
    let tooltip = d3.select("body").select(".stacked-tooltip") as any;
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "stacked-tooltip")
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

    // Define margins and overall dimensions.
    // Increase right margin to squeeze the chart and make space for the legend.
    const margin = { top: 40, right: 100, bottom: 40, left: 80 };
    const overallWidth = 800;
    const overallHeight = 500;
    const chartWidth = overallWidth - margin.left - margin.right;
    const chartHeight = overallHeight - margin.top - margin.bottom;

    // Pivot the revenue data by year.
    // Create an object for each year that holds:
    // • year (number)
    // • yearType (actualOrForecast, assumed consistent across markets for that year)
    // • Each market’s revenue keyed by market name,
    // • Extra keys for percentage change (e.g., `${market}-pct`) looked up from revenueChangeData,
    // • A "total" revenue for that year.
    const dataByYearMap = d3.group(revenueByMarketData, (d) => d.year);
    const dataByYear = Array.from(dataByYearMap, ([year, entries]) => {
      const obj: any = { year: +year };
      obj.yearType = entries[0].actualOrForecast;
      entries.forEach((entry) => {
        obj[entry.market] = entry.revenue;
        const changeItem = revenueChangeData.find(
          (r) => r.market === entry.market && r.year === entry.year
        );
        if (changeItem) {
          obj[`${entry.market}-pct`] = changeItem.revenueChange;
        }
      });
      const marketsForYear = Array.from(new Set(entries.map((e) => e.market)));
      obj.total = marketsForYear.reduce((sum, m) => sum + (obj[m] || 0), 0);
      return obj;
    });
    // Sort by ascending year.
    dataByYear.sort((a, b) => a.year - b.year);

    // Get unique markets sorted alphabetically.
    let markets = Array.from(new Set(revenueByMarketData.map((d) => d.market)));
    markets.sort((a, b) => a.localeCompare(b));
    // For vertical stacking with the alphabetical order from top to bottom,
    // we reverse the stacking order (since the first series is drawn at the bottom).
    const stackKeys = markets.slice();
    const stackGenerator = d3.stack().keys(stackKeys);
    stackGenerator.order(d3.stackOrderReverse);
    const series = stackGenerator(dataByYear);

    // Use Tableau Classic Colors for six segments.
    // Tableau recommended palette for qualitative data:
    // Blue, Orange, Red, Teal, Green, Yellow.
    const tableauColors = [
      "#4E79A7", // Blue
      "#F28E2B", // Orange
      "#E15759", // Red
      "#76B7B2", // Teal
      "#59A14F", // Green
      "#EDC948", // Yellow
    ];
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(markets)
      .range(tableauColors);

    // Create scales.
    // x-scale: band scale for years.
    const xScale = d3
      .scaleBand()
      .domain(dataByYear.map((d) => d.year.toString()))
      .range([0, chartWidth])
      .padding(0.1);

    // y-scale: linear for revenue.
    const maxTotal = d3.max(dataByYear, (d) => d.total) || 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxTotal])
      .range([chartHeight, 0])
      .nice();

    // Set the SVG dimensions.
    svg
      .attr(
        "viewBox",
        `0 0 ${chartWidth + margin.left + margin.right} ${
          chartHeight + margin.top + margin.bottom
        }`
      )
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom);

    // Append the main chart group.
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Draw a background rectangle per year to indicate forecast data.
    // For vertical bars, draw a rect spanning xScale(year) and the full height of the bar.
    chartGroup
      .selectAll(".year-bg")
      .data(dataByYear)
      .enter()
      .append("rect")
      .attr("class", "year-bg")
      .attr("x", (d) => xScale(d.year.toString())!)
      .attr("y", (d) => yScale(d.total))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.total))
      .style("fill", "none")
      .style("stroke", (d) => (d.yearType === "forecast" ? "#aaa" : "none"))
      .style("stroke-dasharray", (d) =>
        d.yearType === "forecast" ? "4 2" : "0"
      );

    // Draw the stacked segments.
    // Vertical bars:
    // • x: xScale(year)
    // • width: xScale.bandwidth()
    // • y: yScale(segment end)
    // • height: yScale(segment start) - yScale(segment end)
    const seriesGroup = chartGroup
      .selectAll(".series")
      .data(series)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", (d) => colorScale(d.key) as string);

    seriesGroup
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.year.toString())!)
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .on("mouseover", function (event, d) {
        // Retrieve the market key from the parent group.
        const market = d3.select(this.parentNode).datum().key;
        const revenueSegment = d[1] - d[0];
        const pctChange = d.data[`${market}-pct`];
        tooltip
          .html(
            `<strong>${market}</strong><br/>
             Type: ${d.data.yearType}<br/>
             Year: ${d.data.year}<br/>
             Revenue: ${d3.format(",.0f")(revenueSegment)}<br/>
             Percentage Change: ${d3.format(".1f")(pctChange || 0)}%`
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

    // Add the x-axis (years).
    const xAxis = d3.axisBottom(xScale);
    chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    // Add the y-axis (Revenue) with custom tick formatting.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(6)
      .tickFormat((d) =>
        d === 0 ? "0.0" : d3.format(",.0f")(Number(d) / 1e6) + "M"
      );
    chartGroup.append("g").attr("class", "y-axis").call(yAxis);

    // Add y-axis label.
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight / 2)
      .attr("y", -75)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .text("Revenue");

    // Add x-axis label.
    chartGroup
      .append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .style("text-anchor", "middle")
      .style("fill", "#fff")
      .text("Year");

    // --- Add a line indicator between 2024 and 2025 ---
    const year2024 = xScale("2024");
    const year2025 = xScale("2025");
    if (year2024 !== undefined && year2025 !== undefined) {
      // Calculate the right edge of the 2024 band and the left edge of the 2025 band.
      const boundaryX = (year2024 + xScale.bandwidth() + year2025) / 2;
      // Draw the vertical dashed line.
      chartGroup
        .append("line")
        .attr("x1", boundaryX)
        .attr("x2", boundaryX)
        .attr("y1", -30)
        .attr("y2", chartHeight)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");

      // Add label "Actual" on the left of the line.
      chartGroup
        .append("text")
        .attr("x", boundaryX / 2)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .style("fill", "#fff")
        .style("font-size", "14px")
        .text("Actual");

      // Add label "Forecast" on the right of the line.
      chartGroup
        .append("text")
        .attr("x", (boundaryX + chartWidth) / 2 - 30)
        .attr("y", 0)
        .attr("text-anchor", "start")
        .style("fill", "#fff")
        .style("font-size", "14px")
        .text("Forecast");
    }

    // --- Add Legend at the top right ---
    const legendRectSize = 15;
    const legendSpacing = 5;
    const legendGroupSvg = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${chartWidth + margin.left}, ${margin.top - 30})`
      );

    // For each market (alphabetically sorted), add a legend item.
    markets.forEach((market, i) => {
      const legendItem = legendGroupSvg
        .append("g")
        .attr("class", "legend-item")
        .attr(
          "transform",
          `translate(0, ${i * (legendRectSize + legendSpacing)})`
        );
      legendItem
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .attr("fill", colorScale(market) as string)
        .attr("stroke", "#fff");
      legendItem
        .append("text")
        .attr("x", legendRectSize + 5)
        .attr("y", legendRectSize / 2)
        .attr("dy", "0.35em")
        .style("fill", "#fff")
        .style("font-size", "12px")
        .text(truncateLabel(market, 10));
    });
  }, [revenueByMarketData, revenueChangeData]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartColumnStacked className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Revenue By Segment Distribution
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
