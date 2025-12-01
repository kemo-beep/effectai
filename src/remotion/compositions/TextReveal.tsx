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

interface TextRevealProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const words = text.split(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          maxWidth: "80%",
        }}
      >
        {words.map((word, i) => {
          const delay = i * 5;
          const progress = spring({
            fps,
            frame: frame - delay,
            config: { damping: 12, stiffness: 100 },
          });

          const opacity = interpolate(progress, [0, 1], [0, 1]);
          const translateY = interpolate(progress, [0, 1], [50, 0]);
          const scale = interpolate(progress, [0, 1], [0.8, 1]);

          // Exit animation
          const exitStart = durationInFrames - 30;
          const exitProgress = interpolate(
            frame,
            [exitStart, durationInFrames],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontSize: 72,
                fontWeight: 900,
                color: colors.text,
                opacity: opacity * exitOpacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                textShadow: glowEffect
                  ? `0 0 40px ${colors.primary}, 0 0 80px ${colors.secondary}`
                  : "none",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          width: interpolate(
            spring({ fps, frame: frame - 20, config: { damping: 15 } }),
            [0, 1],
            [0, 300]
          ),
          height: 4,
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
