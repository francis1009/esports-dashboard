import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Earth } from "lucide-react";

interface GlobalRevenueData {
  country: string;
  year: number;
  revenue: number;
}

interface GlobalRevenueDistributionChartProps {
  globalRevenueData: GlobalRevenueData[];
}

export default function GlobalRevenueDistributionChart({
  globalRevenueData,
}: GlobalRevenueDistributionChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || globalRevenueData.length === 0) {
      console.warn("GlobalRevenueDistributionChart: Missing required data.");
      return;
    }

    // Clear any previous content.
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    // Create (or reselect) a tooltip for country hover info.
    let tooltip = d3.select("body").select(".map-tooltip") as any;
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "map-tooltip")
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

    // Aggregate total revenue by country.
    const revenueByCountry = d3.rollup(
      globalRevenueData,
      (v) => d3.sum(v, (d) => d.revenue),
      (d) => d.country
    );
    const revenues = Array.from(revenueByCountry.values());
    const minRevenue = d3.min(revenues) ?? 0;
    const maxRevenue = d3.max(revenues) ?? 0;

    // Get chart dimensions.
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;

    // Create a sequential color scale.
    const colorScale = d3
      .scaleSequential(d3.interpolateGnBu)
      .domain([minRevenue, maxRevenue]);

    // Create a Mercator projection.
    const projection = d3.geoMercator();

    // Create a group for map features that will be panned and zoomed.
    const mapGroup = svg.append("g").attr("class", "map-group");

    // Create a zoom behavior.
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        mapGroup.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Load world GeoJSON.
    // ISSUES: Small countries like Singapore are not visible.
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
      .then((worldData: any) => {
        // Fit the projection to the SVG dimensions.
        projection.fitSize([width, height], worldData);
        const pathGen = d3.geoPath().projection(projection);

        // Calculate the actual drawn map's bounds.
        const bounds = pathGen.bounds(worldData);
        const mapWidth = bounds[1][0] - bounds[0][0];

        // Draw 7 copies for panning.
        const offsets = [-3, -2, -1, 0, 1, 2, 3];
        offsets.forEach((offset) => {
          mapGroup
            .selectAll(`path.offset${offset}`)
            .data(worldData.features)
            .enter()
            .append("path")
            .attr("class", "country-path")
            .attr("d", pathGen as any)
            .attr("fill", (d: any) => {
              const countryName = d.properties.name;
              const revenue = revenueByCountry.get(countryName);
              return revenue ? colorScale(revenue) : "#ccc";
            })
            .attr("stroke", "#333")
            .attr("stroke-width", 0.1)
            // Offset the map copies horizontally based on the computed mapWidth.
            .attr("transform", `translate(${offset * mapWidth}, 0)`)
            .style("opacity", 0) // Start invisible for animation
            .on("mouseover", function (_, d: any) {
              const countryName = d.properties.name;
              const revenue = revenueByCountry.get(countryName) || 0;
              if (!revenue) return; // Do not show tooltip if there's no revenue.
              d3.select(this)
                .attr("stroke-width", 0.5)
                .attr("stroke", "#FF0000")
                .raise();
              tooltip
                .html(
                  `<strong>${countryName}</strong><br/>Revenue: $${d3.format(
                    ",.0f"
                  )(revenue)}`
                )
                .style("opacity", "0.9");
            })
            .on("mousemove", function (event: MouseEvent, d: any) {
              const countryName = d.properties.name;
              const revenue = revenueByCountry.get(countryName) || 0;
              if (!revenue) return; // If no revenue, do nothing.
              tooltip
                .style("left", event.pageX + 12 + "px")
                .style("top", event.pageY + "px");
            })
            .on("mouseout", function () {
              d3.select(this).attr("stroke-width", 0.1).attr("stroke", "#333");
              tooltip.style("opacity", "0");
            })
            .transition()
            .duration(1000)
            .delay((_, i) => i * 5) // Stagger the animation
            .style("opacity", 1); // Fade in
        });

        // --- LEGEND ---
        const legendWidth = 200;
        const legendHeight = 10;
        const legendMargin = { left: 40, bottom: 30 };

        const defs = svg.append("defs");
        const linearGradient = defs
          .append("linearGradient")
          .attr("id", "legend-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");
        linearGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", colorScale(minRevenue));
        linearGradient
          .append("stop")
          .attr("offset", "50%")
          .attr("stop-color", colorScale((minRevenue + maxRevenue) / 2));
        linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorScale(maxRevenue));

        const legendGroup = svg
          .append("g")
          .attr("class", "legend-group")
          .attr(
            "transform",
            `translate(${legendMargin.left}, ${
              height - legendHeight - legendMargin.bottom
            })`
          );

        legendGroup
          .append("rect")
          .attr("width", 0) // Start with zero width for animation
          .attr("height", legendHeight)
          .style("fill", "url(#legend-gradient)")
          .transition() // Animate the legend
          .duration(1500)
          .attr("width", legendWidth); // Expand to full width

        const legendScale = d3
          .scaleLinear()
          .domain([minRevenue, maxRevenue])
          .range([0, legendWidth]);

        const legendAxis = d3
          .axisBottom(legendScale)
          .tickValues([minRevenue, maxRevenue])
          .tickFormat(d3.format(",.0f"));

        legendGroup
          .append("g")
          .attr("transform", `translate(0, ${legendHeight})`)
          .style("opacity", 0) // Start invisible
          .call(legendAxis)
          .transition() // Animate the legend axis
          .duration(800)
          .delay(1000)
          .style("opacity", 1); // Fade in
      })
      .catch((error) => {
        console.error("Error loading world GeoJSON:", error);
      });
  }, [globalRevenueData]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <Earth className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Global Revenue Distribution
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-[500px]">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
