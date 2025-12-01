"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface ReactionPopupProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const ReactionPopup: React.FC<ReactionPopupProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popIn = spring({ fps, frame, config: { damping: 6, stiffness: 250 } });
  const scale = interpolate(popIn, [0, 1], [0, 1]);
  const rotation = interpolate(popIn, [0, 1], [-30, 0]);

  // Wiggle effect
  const wiggle = Math.sin(frame * 0.3) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
      {/* Circle highlight */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `8px solid ${colors.primary}`,
          transform: `scale(${scale})`,
          opacity: 0.6,
        }}
      />

      {/* Emoji/reaction */}
      <div
        style={{
          fontSize: 200,
          transform: `scale(${scale}) rotate(${rotation + wiggle}deg)`,
          filter: `drop-shadow(0 10px 40px ${colors.primary}80)`,
        }}
      >
        {text}
      </div>

      {/* Radiating circles */}
      {[...Array(3)].map((_, i) => {
        const delay = i * 10;
        const circleProgress = spring({ fps, frame: frame - delay, config: { damping: 20 } });
        const circleScale = interpolate(circleProgress, [0, 1], [0.8, 1.5]);
        const circleOpacity = interpolate(circleProgress, [0, 1], [0.8, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              border: `4px solid ${colors.secondary}`,
              transform: `scale(${circleScale})`,
              opacity: circleOpacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
