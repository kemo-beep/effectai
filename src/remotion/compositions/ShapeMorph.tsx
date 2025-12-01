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

loadFont("normal", { subsets: ["latin"], weights: ["400", "700"] });

interface ShapeMorphProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const ShapeMorph: React.FC<ShapeMorphProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Morph progress
  const morphProgress = interpolate(frame, [0, durationInFrames], [0, 1]);

  // Shape border radius morphing
  const borderRadius = interpolate(
    Math.sin(morphProgress * Math.PI * 4),
    [-1, 1],
    [20, 50]
  );

  // Scale pulse
  const scale = 1 + Math.sin(frame * 0.1) * 0.05;

  // Rotation
  const rotation = frame * 0.5;

  // Text animation
  const textProgress = spring({
    fps,
    frame: frame - 20,
    config: { damping: 12 },
  });

  // Exit
  const exitStart = durationInFrames - 25;
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Morphing shapes */}
      {[...Array(3)].map((_, i) => {
        const size = 200 + i * 80;
        const shapeRotation = rotation * (1 - i * 0.3);
        const shapeBorderRadius = borderRadius + i * 10;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              background:
                i === 0
                  ? `linear-gradient(${rotation}deg, ${colors.primary}, ${colors.secondary})`
                  : "transparent",
              border: i > 0 ? `2px solid ${colors.primary}40` : "none",
              borderRadius: `${shapeBorderRadius}%`,
              transform: `rotate(${shapeRotation}deg) scale(${scale})`,
              opacity: exitOpacity * (1 - i * 0.2),
              boxShadow:
                glowEffect && i === 0
                  ? `0 0 60px ${colors.primary}60`
                  : "none",
            }}
          />
        );
      })}

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          opacity: textProgress * exitOpacity,
          transform: `scale(${interpolate(textProgress, [0, 1], [0.8, 1])})`,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 36,
            fontWeight: 700,
            color: colors.text,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          {text}
        </span>
      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + frame * 0.02;
        const radius = 250 + Math.sin(frame * 0.05 + i) * 30;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={`particle-${i}`}
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              backgroundColor: i % 2 === 0 ? colors.primary : colors.secondary,
              borderRadius: "50%",
              transform: `translate(${x}px, ${y}px)`,
              opacity: exitOpacity * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
