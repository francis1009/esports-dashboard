import { useEffect, useRef } from "react";
import { ChartArea } from "lucide-react";
import * as d3 from "d3";

interface PeakViewersData {
  year: number;
  game: string;
  peakViewers: number;
}

interface PeakViewersChartProps {
  topNGames: number;
  data: PeakViewersData[];
  topGames?: string[]; // optional shared list from parent
}

interface DataRow {
  year: number;
  [key: string]: number;
}

// Utility to truncate a string from the END if it's too long
function truncateLabel(name: string, maxLen = 25) {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export default function PeakViewersChart({
  topNGames,
  data,
  topGames: sharedTopGames,
}: PeakViewersChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // 1) Aggregate data & pick top N
    const totals = d3.rollups(
      data,
      (v) => d3.sum(v, (d) => d.peakViewers),
      (d) => d.game
    );
    totals.sort((a, b) => d3.descending(a[1], b[1]));
    const computedTopGames = totals.slice(0, topNGames).map(([g]) => g);
    const finalTopGames = sharedTopGames || computedTopGames;

    // Group by year => sum per game => combine non-top into "Others"
    const dataByYear = d3.rollups(
      data,
      (entries) => {
        const sums = d3.rollups(
          entries,
          (v) => d3.sum(v, (d) => d.peakViewers),
          (d) => d.game
        );
        const rowObj: Record<string, number> = {};
        sums.forEach(([gameName, total]) => {
          if (finalTopGames.includes(gameName)) {
            rowObj[gameName] = total;
          } else {
            rowObj["Others"] = (rowObj["Others"] || 0) + total;
          }
        });
        return rowObj;
      },
      (d) => d.year
    );
    dataByYear.sort((a, b) => d3.ascending(a[0], b[0]));

    let allKeys = [...finalTopGames];
    const hasOthers = dataByYear.some(([_, obj]) => "Others" in obj);
    if (hasOthers) {
      allKeys = [...finalTopGames.slice().reverse(), "Others"];
    } else {
      allKeys = finalTopGames.slice().reverse();
    }

    const finalDataForStack: DataRow[] = dataByYear.map(([year, obj]) => {
      const row: DataRow = { year };
      allKeys.forEach((k) => {
        row[k] = obj[k] || 0;
      });
      return row;
    });

    const stackGenerator = d3
      .stack<DataRow>()
      .keys(allKeys)
      .order(d3.stackOrderReverse)
      .offset(d3.stackOffsetNone);

    const stackedSeries = stackGenerator(finalDataForStack);

    // 2) Dimensions (use bigger right margin for legend)
    const margin = { top: 20, right: 140, bottom: 40, left: 60 };
    const fullWidth = chartRef.current.clientWidth;
    const fullHeight = 400;

    const width = fullWidth - margin.left - margin.right;
    const height = fullHeight - margin.top - margin.bottom;

    // 3) Create or select persistent container group
    const root = d3.select(chartRef.current);

    let svg = root.select<SVGGElement>("g.chart-content");
    if (svg.empty()) {
      svg = root
        .attr("width", fullWidth)
        .attr("height", fullHeight)
        .append("g")
        .attr("class", "chart-content")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      svg.append("g").attr("class", "area-group");
      svg.append("g").attr("class", "x-axis");
      svg.append("g").attr("class", "y-axis");
      svg.append("g").attr("class", "legend-group");
      svg.append("g").attr("class", "hover-dots-group");
      svg.append("rect").attr("class", "overlay-rect");
    } else {
      root.attr("width", fullWidth).attr("height", fullHeight);
    }

    // 4) Scales
    const years = finalDataForStack.map((d) => d.year);
    const xExtent = d3.extent(years) as [number, number];
    const xScale = d3.scaleLinear().domain(xExtent).range([0, width]).nice();

    const maxY = d3.max(stackedSeries, (layer) =>
      d3.max(layer, (seq) => seq[1])
    ) as number;
    const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]).nice();

    // 5) Axes with transitions
    const xAxisCall = d3
      .axisBottom<number>(xScale)
      .tickFormat(d3.format("d"))
      .ticks(years.length);

    svg
      .select<SVGGElement>("g.x-axis")
      .attr("transform", `translate(0, ${height})`)
      .transition()
      .duration(750)
      .call(xAxisCall)
      .selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#fff");

    const yAxisCall = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s"));

    svg
      .select<SVGGElement>("g.y-axis")
      .transition()
      .duration(750)
      .call(yAxisCall)
      .selectAll("text")
      .style("font-size", "10px")
      .style("fill", "#fff");

    // Create axis labels if missing
    if (svg.selectAll("text.x-axis-label").empty()) {
      svg
        .append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .style("fill", "#fff")
        .text("Year");
    }

    if (svg.selectAll("text.y-axis-label").empty()) {
      svg
        .append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("transform", "rotate(-90)")
        .style("fill", "#fff")
        .text("Peak Viewers");
    }

    // 6) Area generators
    const colorMap: Record<string, string> = {
      Sports: "#8dd3c7",
      VALORANT: "#ffffb3",
      "Grand Theft Auto V": "#bebada",
      Minecraft: "#fb8072",
      "Dota 2": "#80b1d3",
      "Counter-Strike: Global Offensive": "#fdb462",
      Fortnite: "#b3de69",
      "Call of Duty: Warzone": "#fccde5",
      "World of Warcraft": "#bc80bd",
      "League of Legends": "#ffed6f",
      Others: "#d9d9d9",
    };

    const areaGenerator = d3
      .area<d3.SeriesPoint<DataRow>>()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    const areaGeneratorZero = d3
      .area<d3.SeriesPoint<DataRow>>()
      .x((d) => xScale(d.data.year))
      .y0(() => yScale(0))
      .y1(() => yScale(0));

    // 7) Update stacked area paths (enter/update/exit)
    const areaGroup = svg.select<SVGGElement>("g.area-group");
    const layerSelection = areaGroup
      .selectAll<SVGPathElement, d3.Series<DataRow, string>>(".layer")
      .data(stackedSeries, (d) => d.key);

    // ENTER
    const layerEnter = layerSelection
      .enter()
      .append("path")
      .attr("class", "layer")
      .attr("fill", (d) => colorMap[d.key] || "#ccc")
      .attr("d", (d) => areaGeneratorZero(d));

    // ENTER + UPDATE
    layerEnter
      .merge(layerSelection)
      .transition()
      .duration(750)
      .attr("d", (d) => areaGenerator(d));

    // EXIT
    layerSelection
      .exit()
      .transition()
      .duration(750)
      .attr("d", (d) => areaGeneratorZero(d as d3.SeriesPoint<DataRow>[]))
      .remove();

    // 8) Legend with transitions (enter/update/exit)
    const legendGroup = svg.select<SVGGElement>("g.legend-group");
    const legendData = [...allKeys].reverse();
    const legendSelection = legendGroup
      .selectAll<SVGGElement, string>(".legend-item")
      .data(legendData, (d) => d);

    // ENTER
    const legendEnter = legendSelection
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(${width + 10}, ${i * 20})`)
      .attr("opacity", 0);

    legendEnter
      .append("rect")
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d) => colorMap[d] || "#ccc");

    legendEnter
      .append("text")
      .attr("x", 18)
      .attr("y", 10)
      .style("font-size", "10px")
      .style("fill", "#fff")
      .text((d) => truncateLabel(d, 20));

    // ENTER + UPDATE
    const legendUpdate = legendEnter.merge(legendSelection);
    legendUpdate
      .transition()
      .duration(750)
      .attr("opacity", 1)
      // Place legend items in the right margin
      .attr("transform", (_, i) => `translate(${width + 10}, ${i * 20})`);

    legendUpdate.select("rect").attr("fill", (d) => colorMap[d] || "#ccc");
    legendUpdate.select("text").text((d) => truncateLabel(d, 20));

    // EXIT
    legendSelection
      .exit()
      .transition()
      .duration(750)
      .attr("opacity", 0)
      .remove();

    // 9) Tooltip & mouse overlay
    let tooltip = d3.select<HTMLDivElement, unknown>(".peak-viewers-tooltip");
    if (tooltip.empty()) {
      tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "peak-viewers-tooltip")
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

    const hoverGroup = svg.select<SVGGElement>("g.hover-dots-group");
    let dotTop = hoverGroup.select<SVGCircleElement>("circle.dot-top");
    if (dotTop.empty()) {
      dotTop = hoverGroup
        .append("circle")
        .attr("class", "dot-top")
        .attr("r", 3)
        .attr("fill", "#fff")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }
    let dotBottom = hoverGroup.select<SVGCircleElement>("circle.dot-bottom");
    if (dotBottom.empty()) {
      dotBottom = hoverGroup
        .append("circle")
        .attr("class", "dot-bottom")
        .attr("r", 3)
        .attr("fill", "#fff")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }

    const overlayRect = svg.select<SVGRectElement>("rect.overlay-rect");
    overlayRect
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", function (event) {
        const [mx, my] = d3.pointer(event, this);

        // Find closest year index
        const xValue = xScale.invert(mx);
        const bisect = d3.bisector<number, number>((d) => d).center;
        let i = bisect(years, xValue);
        i = Math.max(0, Math.min(i, years.length - 1));
        const hoveredYear = years[i];

        // Check which layer we are over
        let hoveredLayer: d3.Series<DataRow, string> | null = null;
        stackedSeries.forEach((layer) => {
          const [val0, val1] = layer[i];
          const y0Screen = yScale(val0);
          const y1Screen = yScale(val1);
          if (my >= y1Screen && my <= y0Screen) {
            hoveredLayer = layer;
          }
        });
        if (!hoveredLayer) {
          dotTop.style("opacity", 0);
          dotBottom.style("opacity", 0);
          tooltip.style("opacity", 0);
          return;
        }

        const gameName = (hoveredLayer as d3.Series<DataRow, string>).key;
        const [val0, val1] = (hoveredLayer as d3.Series<DataRow, string>)[i];
        const sliceValue = val1 - val0;

        dotTop
          .attr("cx", xScale(hoveredYear))
          .attr("cy", yScale(val1))
          .style("opacity", 1);

        dotBottom
          .attr("cx", xScale(hoveredYear))
          .attr("cy", yScale(val0))
          .style("opacity", 1);

        tooltip
          .style("opacity", 1)
          .html(
            `
            <div><strong>${gameName}</strong></div>
            <div>Year: ${hoveredYear}</div>
            <div>Peak viewers: ${d3.format(",")(sliceValue)}</div>
          `
          )
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", () => {
        dotTop.style("opacity", 0);
        dotBottom.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
  }, [data, topNGames, sharedTopGames]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden col-span-2">
      <div className="p-4 border-b border-gray-800/20">
        <div className="flex items-center gap-2 mb-1">
          <ChartArea className="h-5 w-5 text-[#6366f1]" />
          <h3 className="font-medium text-white">
            Top {topNGames} Games By Peak Viewers
          </h3>
        </div>
      </div>
      <div className="bg-[#0c101a] p-4 flex items-center justify-center h-300px">
        <svg ref={chartRef} width="100%" height="100%" />
      </div>
    </div>
  );
}
