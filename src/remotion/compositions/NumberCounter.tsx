"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "800", "900"] });

interface NumberCounterProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parse number and suffix from text (e.g., "1M+ Users" -> 1000000, "M+ Users")
  const match = text.match(/^([\d.]+)([KMB]?\+?)(.*)$/i);
  const baseNum = match ? parseFloat(match[1]) : 100;
  const suffix = match ? match[2] : "";
  const label = match ? match[3].trim() : text;

  const multiplier = suffix.toUpperCase().includes("K") ? 1000 :
                     suffix.toUpperCase().includes("M") ? 1000000 :
                     suffix.toUpperCase().includes("B") ? 1000000000 : 1;
  
  const targetValue = baseNum * (multiplier > 1 ? 1 : baseNum);

  const progress = spring({ fps, frame, config: { damping: 30, stiffness: 80 } });
  const currentValue = Math.floor(interpolate(progress, [0, 1], [0, targetValue]));

  const formatNumber = (num: number) => {
    if (multiplier >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (multiplier >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (multiplier >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  // Exit animation
  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
      {/* Animated circles */}
      {[...Array(3)].map((_, i) => {
        const circleProgress = spring({ fps, frame: frame - i * 10, config: { damping: 15 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 400 + i * 100,
              height: 400 + i * 100,
              border: `3px solid ${colors.primary}${Math.floor((1 - i * 0.3) * 50).toString(16).padStart(2, "0")}`,
              borderRadius: "50%",
              transform: `scale(${circleProgress})`,
              opacity: exitOpacity,
            }}
          />
        );
      })}

      <div style={{ textAlign: "center", opacity: exitOpacity }}>
        {/* Main number */}
        <div
          style={{
            fontFamily,
            fontSize: 180,
            fontWeight: 900,
            color: colors.primary,
            lineHeight: 1,
            textShadow: glowEffect ? `0 0 60px ${colors.primary}` : "none",
          }}
        >
          {formatNumber(currentValue)}
          {suffix.includes("+") && "+"}
        </div>

        {/* Label */}
        {label && (
          <div
            style={{
              fontFamily,
              fontSize: 48,
              fontWeight: 400,
              color: colors.text,
              marginTop: 20,
              opacity: progress,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
