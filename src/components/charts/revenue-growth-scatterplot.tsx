import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { ChartScatter } from "lucide-react";

interface RevenueByMarketData {
  actualOrForecast: string;
  market: string;
  year: number;
  revenue: number;
}

interface RevenueChangeData {
  market: string;
  year: number;
  revenueChange: number;
}

interface RevenueGrowthScatterPlotProps {
  revenueByMarketData: RevenueByMarketData[];
  revenueChangeData: RevenueChangeData[];
}

export default function RevenueGrowthScatterPlot({
  revenueByMarketData,
  revenueChangeData,
}: RevenueGrowthScatterPlotProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (
      !chartRef.current ||
      revenueByMarketData.length === 0 ||
      revenueChangeData.length === 0
    ) {
      console.warn("RevenueGrowthScatterPlot: Missing required data.");
      return;
    }

    // Clear existing content.
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    let tooltip = d3.select("body").select(".scatter-tooltip") as any;
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "scatter-tooltip")
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

    // 1. Aggregate Data by Market
    const markets = Array.from(
      new Set(revenueByMarketData.map((d) => d.market))
    );
    const aggregated = markets.map((market) => {
      const revs = revenueByMarketData.filter((d) => d.market === market);
      const changes = revenueChangeData.filter((d) => d.market === market);
      const avgRevenue = d3.mean(revs, (d) => d.revenue) ?? 0;
      const sumRevenue = d3.sum(revs, (d) => Math.abs(d.revenue));
      const avgPctChange = d3.mean(changes, (d) => d.revenueChange) ?? 0;
      return { market, avgRevenue, sumRevenue, avgPctChange };
    });

    // 2. Dimensions & SVG Container
    const margin = { top: 20, right: 200, bottom: 50, left: 70 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      );
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 3. Scales
    const xMax = d3.max(aggregated, (d) => d.avgRevenue) ?? 0;
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]).nice();

    const yMin = d3.min(aggregated, (d) => d.avgPctChange) ?? 0;
    const yMax = d3.max(aggregated, (d) => d.avgPctChange) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();

    const rMax = d3.max(aggregated, (d) => d.sumRevenue) ?? 0;
    const rScale = d3.scaleSqrt().domain([0, rMax]).range([3, 10]);

    // Color scale using Tableau Classic Colors.
    const sortedMarkets = markets.slice().sort((a, b) => a.localeCompare(b));
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
      .domain(sortedMarkets)
      .range(tableauColors);

    // 4. Axes & Axis Labels
    // x-axis: Avg. Revenue. Tick labels: 500M, 1,000M, etc.
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(8)
      .tickFormat((d) => d3.format(",.0f")(Number(d) / 1e6) + "M");

    const xAxisGroup = chartGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .style("opacity", 0); // Start invisible for animation

    xAxisGroup.call(xAxis);

    xAxisGroup.transition().duration(800).style("opacity", 1); // Fade in

    // y-axis: Avg. Percentage Change.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(8)
      .tickFormat((d) => d + "%");

    const yAxisGroup = chartGroup
      .append("g")
      .attr("class", "y-axis")
      .style("opacity", 0); // Start invisible for animation

    yAxisGroup.call(yAxis);

    yAxisGroup.transition().duration(800).style("opacity", 1); // Fade in

    // x-axis label.
    chartGroup
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "14px")
      .style("opacity", 0) // Start invisible for animation
      .text("Avg. Revenue")
      .transition()
      .duration(800)
      .delay(800)
      .style("opacity", 1); // Fade in

    // y-axis label.
    chartGroup
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .style("font-size", "14px")
      .style("opacity", 0) // Start invisible for animation
      .text("Avg. Percentage Change")
      .transition()
      .duration(800)
      .delay(800)
      .style("opacity", 1); // Fade in

    // 5. Draw Scatter Points & Tooltip
    chartGroup
      .selectAll("circle")
      .data(aggregated)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.avgRevenue))
      .attr("cy", (d) => yScale(d.avgPctChange))
      .attr("r", 0) // Start with radius 0 for animation
      .attr("fill", (d) => colorScale(d.market) as string)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("opacity", 0) // Start invisible for animation
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", 2)
          .attr("opacity", 1);
        tooltip
          .html(
            `<strong>${d.market}</strong><br/>
              Absolute Revenue: ${d3.format("$,.0f")(d.sumRevenue)}<br/>
              Average Revenue: ${d3.format("$,.0f")(d.avgRevenue)}<br/>
              Percentage Change: ${d3.format(".1f")(d.avgPctChange)}%`
          )
          .style("opacity", 1)
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + 12 + "px");
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
      .duration(1000)
      .delay((_, i) => i * 100) // Stagger the animation
      .attr("r", (d) => rScale(d.sumRevenue)) // Grow to full size
      .attr("opacity", 0.8);

    // 6. Draw Color Legend (Top Right)
    const colorLegendGroup = svg
      .append("g")
      .attr("class", "color-legend")
      .attr(
        "transform",
        `translate(${width + margin.left + 20}, ${margin.top})`
      );

    sortedMarkets.forEach((market, i) => {
      const legendItem = colorLegendGroup
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", `translate(0, ${i * 20})`)
        .style("opacity", 0); // Start invisible for animation

      legendItem
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale(market) as string)
        .attr("stroke", "#fff");

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .text(market);

      // Animate each legend item
      legendItem
        .transition()
        .duration(500)
        .delay(1000 + i * 100)
        .style("opacity", 1); // Fade in
    });

    // 7. Draw Size Legend (Below Color Legend)
    const sizeLegendGroup = svg
      .append("g")
      .attr("class", "size-legend")
      .attr(
        "transform",
        `translate(${width + margin.left + 20}, ${
          margin.top + sortedMarkets.length * 20 + 20
        })`
      );

    // Add a size legend title.
    sizeLegendGroup
      .append("text")
      .attr("x", 5)
      .attr("y", 10)
      .attr("fill", "#fff")
      .attr("font-size", "15px")
      .style("opacity", 0) // Start invisible for animation
      .text("Absolute Revenue")
      .transition() // Add animation
      .duration(500)
      .delay(1400)
      .style("opacity", 1); // Fade in

    // Generate 5 representative size values (e.g., 20%, 40%, 60%, 80%, 100% of the rMax).
    const sizeValues = [rMax * 0.2, rMax * 0.4, rMax * 0.6, rMax * 0.8, rMax];

    sizeValues.forEach((val, i) => {
      const legendItem = sizeLegendGroup
        .append("g")
        .attr("class", "size-legend-item")
        .attr("transform", `translate(0, ${20 + i * 30})`)
        .style("opacity", 0); // Start invisible for animation

      legendItem
        .append("circle")
        .attr("cx", 15)
        .attr("cy", 15)
        .attr("r", rScale(val))
        .attr("fill", "#ccc")
        .attr("stroke", "#333");

      legendItem
        .append("text")
        .attr("x", rScale(val) + 30)
        .attr("y", 20)
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .text(d3.format(",.0f")(val));

      // Animate each size legend item
      legendItem
        .transition()
        .duration(500)
        .delay(1500 + i * 100)
        .style("opacity", 1); // Fade in
    });
  }, [revenueByMarketData, revenueChangeData]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartScatter className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Revenue Growth Rate vs Absolute Revenue (by Segment)
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
