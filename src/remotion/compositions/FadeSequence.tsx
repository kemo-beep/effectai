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

loadFont("normal", { subsets: ["latin"], weights: ["300", "500", "700"] });

interface FadeSequenceProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const FadeSequence: React.FC<FadeSequenceProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lines = text.split(" ").reduce<string[][]>((acc, word, i) => {
    const lineIndex = Math.floor(i / 3);
    if (!acc[lineIndex]) acc[lineIndex] = [];
    acc[lineIndex].push(word);
    return acc;
  }, []).map(words => words.join(" "));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Gradient background animation */}
      <div
        style={{
          position: "absolute",
          width: "150%",
          height: "150%",
          background: `conic-gradient(from ${frame * 2}deg at 50% 50%, ${colors.primary}20, ${colors.secondary}20, ${colors.primary}20)`,
          filter: "blur(100px)",
        }}
      />

      {/* Text lines with staggered fade */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {lines.map((line, i) => {
          const delay = i * 15;
          const fadeIn = spring({
            fps,
            frame: frame - delay,
            config: { damping: 20 },
          });

          const exitStart = durationInFrames - 30 + i * 5;
          const fadeOut = interpolate(
            frame,
            [exitStart, exitStart + 20],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const y = interpolate(fadeIn, [0, 1], [30, 0]);
          const blur = interpolate(fadeIn, [0, 1], [10, 0]);

          return (
            <div
              key={i}
              style={{
                opacity: fadeIn * fadeOut,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
              }}
            >
              <span
                style={{
                  fontFamily,
                  fontSize: 56,
                  fontWeight: i === 0 ? 700 : 500,
                  color: colors.text,
                  textShadow: glowEffect
                    ? `0 0 30px ${colors.primary}`
                    : "none",
                }}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>

      {/* Decorative lines */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          display: "flex",
          gap: 10,
        }}
      >
        {[...Array(3)].map((_, i) => {
          const lineProgress = spring({
            fps,
            frame: frame - 30 - i * 5,
            config: { damping: 15 },
          });

          return (
            <div
              key={i}
              style={{
                width: interpolate(lineProgress, [0, 1], [0, 60 - i * 15]),
                height: 3,
                backgroundColor: i === 0 ? colors.primary : colors.secondary,
                opacity: lineProgress * 0.8,
                borderRadius: 2,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
