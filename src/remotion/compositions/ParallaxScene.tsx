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

interface ParallaxSceneProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const ParallaxScene: React.FC<ParallaxSceneProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Parallax layers move at different speeds
  const baseMovement = frame * 2;

  // Text entrance
  const textProgress = spring({
    fps,
    frame: frame - 15,
    config: { damping: 12 },
  });

  // Exit
  const exitStart = durationInFrames - 30;
  const exitProgress = interpolate(
    frame,
    [exitStart, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, overflow: "hidden" }}>
      {/* Background layer - slowest */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "100%",
          transform: `translateX(${-baseMovement * 0.1}px)`,
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={`bg-${i}`}
            style={{
              position: "absolute",
              left: `${i * 20}%`,
              top: "60%",
              width: 200,
              height: 200,
              backgroundColor: `${colors.primary}10`,
              borderRadius: "50%",
              filter: "blur(40px)",
            }}
          />
        ))}
      </div>

      {/* Mid layer */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "100%",
          transform: `translateX(${-baseMovement * 0.3}px)`,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={`mid-${i}`}
            style={{
              position: "absolute",
              left: `${i * 25}%`,
              top: `${30 + (i % 3) * 20}%`,
              width: 100,
              height: 100,
              border: `2px solid ${colors.secondary}30`,
              borderRadius: 20,
              transform: `rotate(${45 + i * 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Foreground layer - fastest */}
      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "100%",
          transform: `translateX(${-baseMovement * 0.6}px)`,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={`fg-${i}`}
            style={{
              position: "absolute",
              left: `${i * 30}%`,
              top: `${20 + (i % 2) * 60}%`,
              width: 20,
              height: 20,
              backgroundColor: colors.primary,
              borderRadius: "50%",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Main text - center, slight parallax */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${-baseMovement * 0.05}px)`,
        }}
      >
        <div
          style={{
            opacity: textProgress * (1 - exitProgress),
            transform: `scale(${interpolate(textProgress, [0, 1], [0.9, 1])}) translateY(${interpolate(exitProgress, [0, 1], [0, -50])}px)`,
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
                : `0 4px 30px ${colors.background}`,
            }}
          >
            {text}
          </span>
        </div>
      </AbsoluteFill>

      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse at center, transparent 40%, ${colors.background} 100%)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
