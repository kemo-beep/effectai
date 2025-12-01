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

loadFont("normal", { subsets: ["latin"], weights: ["400", "600", "800"] });

interface SlideTransitionProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Slide panels
  const panel1 = spring({ fps, frame, config: { damping: 15 } });
  const panel2 = spring({ fps, frame: frame - 5, config: { damping: 15 } });
  const panel3 = spring({ fps, frame: frame - 10, config: { damping: 15 } });

  // Text reveal
  const textProgress = spring({
    fps,
    frame: frame - 25,
    config: { damping: 12 },
  });

  // Exit
  const exitStart = durationInFrames - 30;
  const exitProgress = spring({
    fps,
    frame: frame - exitStart,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Sliding panels */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: width / 3,
          height: "100%",
          backgroundColor: colors.primary,
          transform: `translateX(${interpolate(panel1, [0, 1], [-width / 3, 0])}px) translateX(${interpolate(exitProgress, [0, 1], [0, -width / 3])}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 3,
          top: 0,
          width: width / 3,
          height: "100%",
          backgroundColor: colors.secondary,
          transform: `translateY(${interpolate(panel2, [0, 1], [height, 0])}px) translateY(${interpolate(exitProgress, [0, 1], [0, height])}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: width / 3,
          height: "100%",
          backgroundColor: colors.primary,
          transform: `translateX(${interpolate(panel3, [0, 1], [width / 3, 0])}px) translateX(${interpolate(exitProgress, [0, 1], [0, width / 3])}px)`,
        }}
      />

      {/* Center content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: textProgress * (1 - exitProgress),
        }}
      >
        <div
          style={{
            backgroundColor: colors.background,
            padding: "40px 80px",
            borderRadius: 16,
            transform: `scale(${interpolate(textProgress, [0, 1], [0.8, 1])})`,
            boxShadow: glowEffect
              ? `0 0 60px ${colors.primary}40`
              : "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 64,
              fontWeight: 800,
              color: colors.text,
            }}
          >
            {text}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
