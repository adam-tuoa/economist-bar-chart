import { useState, useEffect, useRef } from "react";
import { scaleLinear, scaleBand } from "d3";
import { data } from "./data";

const height = 560;
const margin = { top: 120, right: 20, bottom: 80, left: 20 };
const innerHeight = height - margin.top - margin.bottom;

const sortedData = [...data].sort((a, b) => b.count - a.count);

function App() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(760);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const innerWidth = width - margin.left - margin.right;

  const xScale = scaleLinear().domain([0, 55]).range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(sortedData.map((d) => d.name))
    .range([0, innerHeight])
    .padding(0.2);

  const ticks = xScale.ticks(width < 500 ? 6 : 11);

  const firstOutsideIndex = sortedData.findIndex(
    (d) => xScale(d.count) <= d.name.length * 7.5 + 16,
  );

  return (
    <div ref={containerRef} style={{ padding: "16px", maxWidth: "600px" }}>
      <svg
        width={width}
        height={height}
        fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
      >
        <defs>
          <filter id="textHalo" x="-10%" y="-10%" width="120%" height="120%">
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="3"
              result="dilated"
            />
            <feFlood floodColor="white" result="white" />
            <feComposite in="white" in2="dilated" operator="in" result="bg" />
            <feMerge>
              <feMergeNode in="bg" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line
          x1={margin.left}
          x2={width - margin.right}
          y1={11}
          y2={11}
          stroke="#d8252a"
          strokeWidth={1}
        />
        <rect x={margin.left} y={11} width={24} height={5} fill="#d8252a" />
        <text x={margin.left} y={48} fontSize={18} fontWeight={700}>
          Escape artists
        </text>
        <text x={margin.left} y={72} fontSize={14} fill="#222">
          Number of laboratory-acquired infections, 1970-2021
        </text>
        <text x={margin.left} y={height - 50} fontSize={11} fill="#666">
          Sources: Laboratory-Acquired Infection Database; American Biological
          Safety Association
        </text>
        <text x={margin.left} y={height - 32} fontSize={11} fill="#666">
          The Economist
        </text>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={innerHeight}
            stroke="#222"
            strokeWidth={1}
          />
          {ticks.map((t) => (
            <g key={t} transform={`translate(${xScale(t)}, 0)`}>
              {t !== 0 && <line y1={0} y2={innerHeight} stroke="#e5e5e5" />}
              <text y={-8} textAnchor="middle" fontSize={12} fill="#666">
                {t}
              </text>
            </g>
          ))}
          {sortedData.map((d, i) => {
            const barWidth = xScale(d.count);
            const labelInside =
              firstOutsideIndex === -1 || i < firstOutsideIndex;
            return (
              <g key={d.name} transform={`translate(0, ${yScale(d.name)})`}>
                <rect
                  width={barWidth}
                  height={yScale.bandwidth()}
                  fill="#1f77b4"
                />
                <text
                  x={labelInside ? 8 : barWidth + 6}
                  y={yScale.bandwidth() / 2}
                  dy="0.35em"
                  fontSize={13}
                  fontWeight={600}
                  fill={labelInside ? "white" : "#1f77b4"}
                  filter={labelInside ? undefined : "url(#textHalo)"}
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default App;
