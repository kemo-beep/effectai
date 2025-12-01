"use client";
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", { subsets: ["latin"], weights: ["600", "700"] });

interface SpeechBubbleProps {
  text: string;
  colors: { primary: string; secondary: string; background: string; text: string };
  glowEffect?: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, colors }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const popIn = spring({ fps, frame, config: { damping: 8, stiffness: 200 } });
  const scale = interpolate(popIn, [0, 1], [0, 1]);
  const rotation = interpolate(popIn, [0, 1], [-10, 0]);

  // Wobble effect
  const wobble = Math.sin(frame * 0.2) * 2;

  // Exit
  const exitStart = durationInFrames - 15;
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${scale * exitScale}) rotate(${rotation + wobble}deg)`,
          position: "relative",
        }}
      >
        {/* Main bubble */}
        <div
          style={{
            backgroundColor: colors.primary,
            padding: "30px 50px",
            borderRadius: 30,
            position: "relative",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              fontFamily,
              fontSize: 48,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {text}
          </span>
        </div>

        {/* Bubble tail */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: 60,
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: `30px solid ${colors.primary}`,
            transform: "rotate(-10deg)",
          }}
        />

        {/* Small bubbles */}
        {[...Array(3)].map((_, i) => {
          const bubbleDelay = 10 + i * 5;
          const bubbleProgress = spring({ fps, frame: frame - bubbleDelay, config: { damping: 12 } });
          const size = 20 - i * 5;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                bottom: -50 - i * 25,
                left: 40 - i * 15,
                width: size,
                height: size,
                backgroundColor: colors.primary,
                borderRadius: "50%",
                transform: `scale(${bubbleProgress})`,
                opacity: 0.8 - i * 0.2,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
