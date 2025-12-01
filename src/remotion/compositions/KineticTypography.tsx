"use client";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["400", "700", "900"] });

interface KineticTypographyProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const KineticTypography: React.FC<KineticTypographyProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const chars = text.split("");

  // Background pulse
  const pulse = Math.sin(frame * 0.1) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Animated background shapes */}
      {[...Array(5)].map((_, i) => {
        const rotation = frame * (0.5 + i * 0.2);
        const scale = 0.5 + Math.sin(frame * 0.05 + i) * 0.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 200 + i * 100,
              height: 200 + i * 100,
              border: `2px solid ${colors.primary}20`,
              borderRadius: "50%",
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          />
        );
      })}

      {/* Main text */}
      <div style={{ display: "flex", overflow: "hidden" }}>
        {chars.map((char, i) => {
          const delay = i * 2;
          const progress = spring({
            fps,
            frame: frame - delay,
            config: { damping: 10, stiffness: 150 },
          });

          const y = interpolate(progress, [0, 1], [100, 0]);
          const opacity = interpolate(progress, [0, 0.5, 1], [0, 1, 1]);
          const rotateX = interpolate(progress, [0, 1], [90, 0]);

          // Wave effect
          const wave = Math.sin(frame * 0.15 + i * 0.5) * 5;

          // Exit
          const exitStart = durationInFrames - 20;
          const exitOpacity = interpolate(
            frame,
            [exitStart, durationInFrames],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontSize: 120,
                fontWeight: 900,
                color: colors.text,
                opacity: opacity * exitOpacity,
                transform: `translateY(${y + wave}px) rotateX(${rotateX}deg)`,
                textShadow: glowEffect
                  ? `0 0 30px ${colors.primary}, 0 0 60px ${colors.secondary}`
                  : `2px 2px 0 ${colors.primary}`,
                display: "inline-block",
                perspective: 1000,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(transparent, ${colors.background})`,
          opacity: pulse * 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
