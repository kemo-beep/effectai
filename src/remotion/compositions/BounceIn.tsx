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

interface BounceInProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const BounceIn: React.FC<BounceInProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const chars = text.split("");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}15, transparent 70%)`,
        }}
      />

      {/* Bouncing characters */}
      <div style={{ display: "flex", gap: 4 }}>
        {chars.map((char, i) => {
          const delay = i * 3;
          const bounceProgress = spring({
            fps,
            frame: frame - delay,
            config: { damping: 8, stiffness: 200, mass: 0.5 },
          });

          const y = interpolate(bounceProgress, [0, 1], [-200, 0]);
          const scale = interpolate(bounceProgress, [0, 0.5, 1], [0.5, 1.2, 1]);
          const rotation = interpolate(bounceProgress, [0, 1], [45, 0]);

          // Subtle float after landing
          const floatOffset = Math.sin(frame * 0.1 + i * 0.5) * 3;

          // Exit animation
          const exitStart = durationInFrames - 20;
          const exitProgress = spring({
            fps,
            frame: frame - exitStart - i * 2,
            config: { damping: 10 },
          });
          const exitY = interpolate(exitProgress, [0, 1], [0, 100]);
          const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontSize: 100,
                fontWeight: 900,
                color: colors.text,
                transform: `translateY(${y + floatOffset + exitY}px) scale(${scale}) rotate(${rotation}deg)`,
                opacity: bounceProgress * exitOpacity,
                textShadow: glowEffect
                  ? `0 0 20px ${colors.primary}, 0 0 40px ${colors.secondary}`
                  : `4px 4px 0 ${colors.primary}`,
                display: "inline-block",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>

      {/* Impact lines */}
      {chars.map((_, i) => {
        const delay = i * 3 + 10;
        const lineProgress = spring({
          fps,
          frame: frame - delay,
          config: { damping: 15 },
        });

        if (lineProgress < 0.1) return null;

        return (
          <div
            key={`line-${i}`}
            style={{
              position: "absolute",
              bottom: 350,
              left: `${20 + i * (60 / chars.length)}%`,
              width: 3,
              height: interpolate(lineProgress, [0, 1], [0, 30]),
              backgroundColor: colors.primary,
              opacity: interpolate(lineProgress, [0, 0.5, 1], [0, 1, 0]),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
