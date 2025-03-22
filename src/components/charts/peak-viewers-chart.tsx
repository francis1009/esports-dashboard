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

export default function PeakViewersChart({
  topNGames,
  data,
  topGames: sharedTopGames,
}: PeakViewersChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clear any previous SVG contents
    const root = d3.select(chartRef.current);
    root.selectAll("*").remove();

    // Dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = chartRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = root
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ---- 1) Determine top N games and prepare stacked data ----
    // Compute totals by game based on peakViewers
    const totals = d3.rollups(
      data,
      (v) => d3.sum(v, (d) => d.peakViewers),
      (d) => d.game
    );
    totals.sort((a, b) => d3.descending(a[1], b[1]));
    // Use the sharedTopGames if provided, otherwise compute from totals.
    const computedTopGames = totals.slice(0, topNGames).map((d) => d[0]);
    const topGames = sharedTopGames ? sharedTopGames : computedTopGames;

    const dataByYear = d3.rollups(
      data,
      (entries) => {
        const sums = d3.rollups(
          entries,
          (v) => d3.sum(v, (d) => d.peakViewers),
          (d) => d.game
        );
        const yearObj: Record<string, number> = {};
        sums.forEach(([gameName, total]) => {
          // If game is in topGames, include it; else group into "Others"
          if (topGames.includes(gameName)) {
            yearObj[gameName] = total;
          } else {
            yearObj["Others"] = (yearObj["Others"] || 0) + total;
          }
        });
        return yearObj;
      },
      (d) => d.year
    );

    dataByYear.sort((a, b) => d3.ascending(a[0], b[0]));

    // Build keys for stack generator – show "Others" if present
    let allKeys = [...topGames];
    const hasOthers = dataByYear.some(([_, obj]) => "Others" in obj);
    if (hasOthers) {
      allKeys = [...topGames.slice().reverse(), "Others"];
    } else {
      allKeys = topGames.slice().reverse();
    }

    const finalDataForStack: DataRow[] = dataByYear.map(([year, obj]) => {
      const row: DataRow = { year };
      allKeys.forEach((key) => {
        row[key] = obj[key] || 0;
      });
      return row;
    });

    // Create the stack generator
    const stackGenerator = d3
      .stack<DataRow>()
      .keys(allKeys)
      .order(d3.stackOrderReverse)
      .offset(d3.stackOffsetNone);

    const stackedSeries = stackGenerator(finalDataForStack);

    // ---- 2) Create scales ----
    const years = finalDataForStack.map((d) => d.year);
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(years) as [number, number])
      .range([0, width - 100]);

    const maxY = d3.max(stackedSeries, (layer) =>
      d3.max(layer, (sequence) => sequence[1])
    ) as number;

    const yScale = d3.scaleLinear().domain([0, maxY]).range([height, 0]);

    // ---- 3) Draw the stacked areas ----
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
      Others: "#d9d9d9",
    };

    const areaGenerator = d3
      .area<d3.SeriesPoint<DataRow>>()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

    svg
      .selectAll(".layer")
      .data(stackedSeries)
      .join("path")
      .attr("class", "layer")
      .attr("fill", (d) => colorMap[d.key] || "#ccc")
      .attr("d", (d) => areaGenerator(d));

    // ---- 4) Draw axes ----
    const xAxis = d3
      .axisBottom<number>(xScale)
      .tickFormat(d3.format("d"))
      .ticks(years.length);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "10px");

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", (width - 100) / 2)
      .attr("y", height + 30)
      .text("Year")
      .style("fill", "#fff");

    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".2s"));
    svg.append("g").call(yAxis).selectAll("text").style("font-size", "10px");

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("transform", "rotate(-90)")
      .text("Peak Viewers")
      .style("fill", "#fff");

    // ---- 5) (Optional) Draw legend (color legend) ----
    const legend = svg
      .selectAll(".legend")
      .data(allKeys)
      .join("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(${width - 90}, ${i * 20})`);

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", (d) => colorMap[d] || "#ccc");

    legend
      .append("text")
      .attr("x", 18)
      .attr("y", 10)
      .text((d) => d)
      .style("font-size", "10px")
      .style("fill", "#fff");

    // ------------------------------------------------------------------
    // 6) Create tooltip & circles for hover interaction
    // ------------------------------------------------------------------

    // A simple HTML tooltip (positioned absolutely)
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

    // Two circles: top and bottom for the hovered area
    const dotTop = svg
      .append("circle")
      .attr("r", 3)
      .attr("fill", "#fff")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const dotBottom = svg
      .append("circle")
      .attr("r", 3)
      .attr("fill", "#fff")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // Overlay rectangle to capture mouse events across the chart area
    svg
      .append("rect")
      .attr("class", "overlay")
      .attr("width", width - 100) // same as x-scale range
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event, svg.node());

        // 1) Find the closest year index via xScale
        const xValue = xScale.invert(mx);
        // This finds whichever year in 'years' is closest to xValue
        const bisect = d3.bisector<number, number>((d) => d).center;
        let i = bisect(years, xValue);

        // Ensure i is within array bounds
        i = Math.max(0, Math.min(i, years.length - 1));

        const hoveredYear = years[i];

        // 2) Determine which layer is under the mouse's y position
        let hoveredLayer: any = null;
        stackedSeries.forEach((layer) => {
          const [y0, y1] = layer[i];
          const y0Screen = yScale(y0);
          const y1Screen = yScale(y1);
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

        const gameName = hoveredLayer.key;
        const [val0, val1] = hoveredLayer[i];
        const sliceValue = val1 - val0;

        // Position the two dots at the top and bottom boundaries
        dotTop
          .attr("cx", xScale(hoveredYear))
          .attr("cy", yScale(val1))
          .style("opacity", 1);

        dotBottom
          .attr("cx", xScale(hoveredYear))
          .attr("cy", yScale(val0))
          .style("opacity", 1);

        // Show tooltip with game, year, and peak viewers
        tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 12 + "px")
          .style("top", event.pageY + "px").html(`
            <div><strong>${gameName}</strong></div>
            <div>Year: ${hoveredYear}</div>
            <div>Peak viewers: ${d3.format(",")(sliceValue)}</div>
          `);
      })
      .on("mouseout", () => {
        dotTop.style("opacity", 0);
        dotBottom.style("opacity", 0);
        tooltip.style("opacity", 0);
      });
    return () => {
      tooltip.remove();
    };
  }, [data, topNGames, sharedTopGames]);

  return (
    <div className="bg-[#131825] rounded-lg border border-gray-800/20 overflow-hidden col-span-1">
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
