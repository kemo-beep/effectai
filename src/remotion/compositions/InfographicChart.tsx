"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["600", "800"] });

interface InfographicChartProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const InfographicChart: React.FC<InfographicChartProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Extract number from text (e.g., "75% Growth" -> 75)
  const match = text.match(/(\d+)/);
  const value = match ? parseInt(match[1]) : 75;
  const label = text.replace(/\d+/, "").trim();

  const progress = spring({ fps, frame: frame - 10, config: { damping: 15 } });
  const numberProgress = interpolate(progress, [0, 1], [0, value]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* Animated number */}
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontFamily,
              fontSize: 120,
              fontWeight: 800,
              color: colors.primary,
              textShadow: `0 4px 20px ${colors.primary}40`,
            }}
          >
            {Math.round(numberProgress)}
            {text.includes("%") && "%"}
          </span>
          <div
            style={{
              fontFamily,
              fontSize: 36,
              fontWeight: 600,
              color: colors.text,
              marginTop: 10,
            }}
          >
            {label}
          </div>
        </div>

        {/* Animated bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, height: 400 }}>
          {[...Array(5)].map((_, i) => {
            const barDelay = i * 5;
            const barProgress = spring({ fps, frame: frame - barDelay, config: { damping: 12 } });
            const height = interpolate(barProgress, [0, 1], [0, 100 + i * 60]);

            return (
              <div
                key={i}
                style={{
                  width: 60,
                  height,
                  background: i === 4
                    ? `linear-gradient(to top, ${colors.primary}, ${colors.secondary})`
                    : colors.secondary + "40",
                  borderRadius: "8px 8px 0 0",
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
