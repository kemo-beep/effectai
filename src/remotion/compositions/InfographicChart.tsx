"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "600", "700", "800", "900"] });

interface InfographicChartProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

interface ChartData {
  labels: string[];
  values: number[];
  highlighted?: string[];
}

const parseChartData = (text: string): ChartData => {
  // Check if it's a map with highlighting
  if (text.includes("Highlighted:")) {
    const parts = text.split("|");
    const highlightedPart = parts.find(p => p.startsWith("Highlighted:"));
    const highlighted = highlightedPart ? highlightedPart.replace("Highlighted:", "").trim() : "";
    const countries = parts.filter(p => !p.startsWith("Highlighted:")).map(c => c.trim());

    return {
      labels: [highlighted, ...countries],
      values: Array(countries.length + 1).fill(1),
      highlighted: [highlighted]
    };
  }

  // Check if it's chart data with labels and values
  if (text.includes(":")) {
    const items = text.split("|").map(item => {
      const [label, value] = item.split(":");
      return {
        label: label?.trim() || "",
        value: parseFloat(value?.trim()) || 0
      };
    });

    return {
      labels: items.map(item => item.label),
      values: items.map(item => item.value)
    };
  }

  // Default: treat as simple list
  const items = text.split("|").map(item => item.trim());
  return {
    labels: items,
    values: Array(items.length).fill(1)
  };
};

const PieChart: React.FC<{ data: ChartData; colors: any; progress: number }> = ({ data, colors, progress }) => {
  const total = data.values.reduce((sum, val) => sum + val, 0);
  let currentAngle = -Math.PI / 2; // Start from top

  return (
    <div style={{ position: "relative", width: 400, height: 400 }}>
      <svg width="400" height="400" viewBox="0 0 400 400">
        {data.labels.map((label, i) => {
          const value = data.values[i];
          const percentage = value / total;
          const angle = percentage * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle * progress;

          const x1 = 200 + 150 * Math.cos(startAngle);
          const y1 = 200 + 150 * Math.sin(startAngle);
          const x2 = 200 + 150 * Math.cos(endAngle);
          const y2 = 200 + 150 * Math.sin(endAngle);

          const largeArcFlag = percentage > 0.5 ? 1 : 0;

          currentAngle += angle;

          const isHighlighted = data.highlighted?.includes(label);
          const fillColor = isHighlighted ? colors.primary : colors.secondary;

          return (
            <g key={i}>
              <path
                d={`M 200 200 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={fillColor}
                opacity={isHighlighted ? 1 : 0.7}
                stroke={colors.background}
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      {/* Labels */}
      {data.labels.map((label, i) => {
        const angle = (i / data.labels.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 180;
        const x = 200 + radius * Math.cos(angle);
        const y = 200 + radius * Math.sin(angle);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 50,
              top: y - 10,
              fontFamily,
              fontSize: 14,
              fontWeight: 600,
              color: colors.text,
              textAlign: "center",
              width: 100,
              opacity: progress,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

const BarChart: React.FC<{ data: ChartData; colors: any; progress: number }> = ({ data, colors, progress }) => {
  const maxValue = Math.max(...data.values);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 400, padding: 40 }}>
      {data.labels.map((label, i) => {
        const value = data.values[i];
        const height = (value / maxValue) * 300 * progress;
        const isHighlighted = data.highlighted?.includes(label);

        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 60,
                height,
                background: isHighlighted
                  ? `linear-gradient(to top, ${colors.primary}, ${colors.secondary})`
                  : colors.secondary,
                borderRadius: "4px 4px 0 0",
                boxShadow: isHighlighted ? `0 0 20px ${colors.primary}40` : "none",
                transition: "all 0.3s ease",
              }}
            />
            <div
              style={{
                fontFamily,
                fontSize: 12,
                fontWeight: 600,
                color: colors.text,
                textAlign: "center",
                maxWidth: 80,
                opacity: progress,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily,
                fontSize: 14,
                fontWeight: 700,
                color: colors.primary,
                opacity: progress,
              }}
            >
              {value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LineChart: React.FC<{ data: ChartData; colors: any; progress: number }> = ({ data, colors, progress }) => {
  const maxValue = Math.max(...data.values);
  const points = data.labels.map((_, i) => {
    const x = (i / (data.labels.length - 1)) * 600;
    const y = 300 - (data.values[i] / maxValue) * 250 * progress;
    return `${x + 50},${y + 50}`;
  }).join(" ");

  return (
    <div style={{ padding: 50 }}>
      <svg width="700" height="400" viewBox="0 0 700 400">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="50"
            y1={50 + i * 75}
            x2="650"
            y2={50 + i * 75}
            stroke={colors.secondary + "20"}
            strokeWidth="1"
          />
        ))}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={colors.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={progress}
        />

        {/* Points */}
        {data.labels.map((_, i) => {
          const x = (i / (data.labels.length - 1)) * 600 + 50;
          const y = 300 - (data.values[i] / maxValue) * 250 * progress + 50;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="6"
              fill={colors.primary}
              opacity={progress}
            />
          );
        })}
      </svg>

      {/* Labels */}
      {data.labels.map((label, i) => {
        const x = (i / (data.labels.length - 1)) * 600 + 50;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 30,
              top: 370,
              fontFamily,
              fontSize: 12,
              fontWeight: 600,
              color: colors.text,
              textAlign: "center",
              width: 60,
              opacity: progress,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

const MapVisualization: React.FC<{ data: ChartData; colors: any; progress: number }> = ({ data, colors, progress }) => {
  // Simple world map representation with countries
  const countries = [
    { name: "USA", x: 150, y: 200, size: 80 },
    { name: "Europe", x: 350, y: 180, size: 100 },
    { name: "Asia", x: 500, y: 200, size: 120 },
    { name: "Africa", x: 380, y: 280, size: 90 },
    { name: "Australia", x: 580, y: 320, size: 60 },
  ];

  return (
    <div style={{ position: "relative", width: 800, height: 500 }}>
      {/* World map background */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 30% 30%, ${colors.secondary}20, transparent 50%),
                       radial-gradient(circle at 70% 70%, ${colors.primary}10, transparent 50%)`,
          borderRadius: "20px",
          opacity: 0.3 * progress,
        }}
      />

      {/* Countries */}
      {countries.map((country, i) => {
        const isHighlighted = data.highlighted?.includes(country.name) ||
          data.labels.some(label => label.toLowerCase().includes(country.name.toLowerCase()));

        const scale = interpolate(progress, [0, 1], [0, 1]);
        const opacity = interpolate(progress, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: country.x,
              top: country.y,
              transform: `scale(${scale})`,
              opacity,
            }}
          >
            <div
              style={{
                width: country.size,
                height: country.size * 0.6,
                background: isHighlighted ? colors.primary : colors.secondary + "40",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isHighlighted ? `0 0 30px ${colors.primary}60` : "none",
                border: isHighlighted ? `2px solid ${colors.primary}` : "none",
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontSize: 14,
                  fontWeight: 700,
                  color: isHighlighted ? colors.background : colors.text,
                }}
              >
                {country.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontSize: 32,
          fontWeight: 800,
          color: colors.text,
          textAlign: "center",
          opacity: progress,
        }}
      >
        World Map
      </div>
    </div>
  );
};

export const InfographicChart: React.FC<InfographicChartProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = parseChartData(text);

  // Determine chart type based on data
  const isMap = text.toLowerCase().includes("map") || text.includes("Highlighted:") ||
    data.labels.some(label => ["usa", "europe", "asia", "africa", "australia", "country"].some(c => label.toLowerCase().includes(c)));

  const isPieChart = data.values.length > 2 && data.values.every(v => v > 0) && !isMap;
  const isLineChart = data.labels.length >= 3 && data.values.some((v, i, arr) => i > 0 && v !== arr[i - 1]);

  const progress = spring({ fps, frame: frame - 10, config: { damping: 15, stiffness: 100 } });

  let chartComponent;
  if (isMap) {
    chartComponent = <MapVisualization data={data} colors={colors} progress={progress} />;
  } else if (isPieChart && data.labels.length <= 6) {
    chartComponent = <PieChart data={data} colors={colors} progress={progress} />;
  } else if (isLineChart) {
    chartComponent = <LineChart data={data} colors={colors} progress={progress} />;
  } else {
    chartComponent = <BarChart data={data} colors={colors} progress={progress} />;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        {chartComponent}
      </div>
    </AbsoluteFill>
  );
};
