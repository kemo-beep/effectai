"use client";
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface TransitionEffectProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const TransitionEffect: React.FC<TransitionEffectProps> = ({ colors }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;

  // Wipe transition
  const wipeX = interpolate(progress, [0, 1], [0, width]);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Diagonal wipe */}
      <div
        style={{
          position: "absolute",
          width: width * 1.5,
          height: height * 1.5,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          transform: `translateX(${wipeX - width}px) rotate(45deg)`,
          transformOrigin: "center",
        }}
      />

      {/* Glitch bars */}
      {[...Array(8)].map((_, i) => {
        const barProgress = interpolate(progress, [0, 1], [0, 1]);
        const offset = Math.sin(frame * 0.5 + i) * 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: (i / 8) * height,
              left: offset,
              width: width,
              height: height / 8,
              backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
              opacity: interpolate(barProgress, [0, 0.3, 0.7, 1], [0, 0.3, 0.3, 0]),
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
