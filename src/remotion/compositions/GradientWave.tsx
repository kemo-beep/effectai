"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["700", "800"] });

interface GradientWaveProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const GradientWave: React.FC<GradientWaveProps> = ({ text, colors, glowEffect }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Wave animation
  const waveOffset = frame * 3;

  // Text entrance
  const textProgress = spring({ fps, frame: frame - 20, config: { damping: 15 } });

  // Exit
  const exitStart = durationInFrames - 25;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Animated gradient waves */}
      {[...Array(5)].map((_, i) => {
        const yOffset = height * 0.3 + i * 80;
        const amplitude = 50 + i * 20;
        const frequency = 0.01 - i * 0.001;
        const speed = waveOffset * (1 - i * 0.1);

        const points = [];
        for (let x = 0; x <= width; x += 20) {
          const y = yOffset + Math.sin(x * frequency + speed * 0.05) * amplitude;
          points.push(`${x},${y}`);
        }
        points.push(`${width},${height}`);
        points.push(`0,${height}`);

        return (
          <svg
            key={i}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          >
            <defs>
              <linearGradient id={`wave-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.8 - i * 0.15} />
                <stop offset="50%" stopColor={colors.secondary} stopOpacity={0.6 - i * 0.1} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0.8 - i * 0.15} />
              </linearGradient>
            </defs>
            <polygon points={points.join(" ")} fill={`url(#wave-gradient-${i})`} />
          </svg>
        );
      })}

      {/* Center text */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            opacity: textProgress * exitOpacity,
            transform: `translateY(${interpolate(textProgress, [0, 1], [50, 0])}px)`,
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: 800,
              color: colors.text,
              textShadow: glowEffect
                ? `0 0 40px ${colors.primary}, 0 0 80px ${colors.secondary}`
                : `0 4px 20px rgba(0,0,0,0.3)`,
            }}
          >
            {text}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
