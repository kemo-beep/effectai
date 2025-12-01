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

interface LogoIntroProps {
  text: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  glowEffect?: boolean;
}

export const LogoIntro: React.FC<LogoIntroProps> = ({
  text,
  colors,
  glowEffect = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo reveal animation
  const logoScale = spring({
    fps,
    frame,
    config: { damping: 12, stiffness: 80 },
  });

  const logoRotation = interpolate(
    spring({ fps, frame, config: { damping: 20 } }),
    [0, 1],
    [180, 0]
  );

  // Ring animations
  const ring1 = spring({ fps, frame: frame - 10, config: { damping: 15 } });
  const ring2 = spring({ fps, frame: frame - 20, config: { damping: 15 } });
  const ring3 = spring({ fps, frame: frame - 30, config: { damping: 15 } });

  // Text reveal
  const textProgress = spring({
    fps,
    frame: frame - 40,
    config: { damping: 12 },
  });

  // Exit animation
  const exitStart = durationInFrames - 25;
  const exitProgress = interpolate(
    frame,
    [exitStart, durationInFrames],
    [0, 1],
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
      {/* Animated rings */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          border: `3px solid ${colors.primary}`,
          borderRadius: "50%",
          transform: `scale(${ring1}) rotate(${frame}deg)`,
          opacity: (1 - exitProgress) * 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          border: `2px solid ${colors.secondary}`,
          borderRadius: "50%",
          transform: `scale(${ring2}) rotate(${-frame * 0.7}deg)`,
          opacity: (1 - exitProgress) * 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          border: `2px solid ${colors.primary}`,
          borderRadius: "50%",
          transform: `scale(${ring3}) rotate(${frame * 0.5}deg)`,
          opacity: (1 - exitProgress) * 0.3,
        }}
      />

      {/* Logo placeholder */}
      <div
        style={{
          width: 120,
          height: 120,
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: 24,
          transform: `scale(${logoScale * (1 - exitProgress * 0.5)}) rotate(${logoRotation}deg)`,
          boxShadow: glowEffect
            ? `0 0 60px ${colors.primary}80`
            : "0 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          {text.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Brand text */}
      <div
        style={{
          position: "absolute",
          bottom: 280,
          opacity: textProgress * (1 - exitProgress),
          transform: `translateY(${interpolate(textProgress, [0, 1], [30, 0])}px)`,
        }}
      >
        <span
          style={{
            fontFamily,
            fontSize: 48,
            fontWeight: 700,
            color: colors.text,
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
